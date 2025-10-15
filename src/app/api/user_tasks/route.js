// src/app/api/my_tasks/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const json = Buffer.from(payload, 'base64url').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  const claims = token ? decodeJwt(token) : null;
  const userId = claims.userId;

  // Cast to number if your schema uses Int
  // const userIdRaw = claims?.userId;
  // const userId = isNaN(Number(userIdRaw)) ? userIdRaw : Number(userIdRaw);

  if (!userId) return NextResponse.json([], { status: 200 });

  try {
    // 1) Task links for this user
    const links = await prisma.user_Task.findMany({
      where: { assigned_to_id: userId },
      select: { related_to_id: true },
    });
    if (!links.length) return NextResponse.json([]);

    const taskIds = Array.from(new Set(links.map(l => l.related_to_id)));

    // 2) Fetch the parent tasks with relations
    const tasks = await prisma.task.findMany({
      where: {
        t_id: { in: taskIds },
        parent_task_id: null,
      },
      include: {
        user_tasks: { include: { assigned_to: true } },
        project: true,
        added_by: true,
      },
    });
    if (!tasks.length) return NextResponse.json([]);

    // 3) Aggregate timesheets (two buckets)
    const [hoursAgg, minsAgg] = await Promise.all([
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: { taskId: { in: taskIds }, duration: { lt: 10 } }, // "h" bucket
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: { taskId: { in: taskIds }, duration: { gte: 10 } }, // "min" bucket
      }),
    ]);

    // 4) Build lookup maps
    const hMap = new Map(hoursAgg.map(r => [r.taskId, r._sum?.duration ?? 0]));
    const mMap = new Map(minsAgg.map(r => [r.taskId, r._sum?.duration ?? 0]));

    // 5) Attach computed fields + extras
    const out = tasks.map((t, index) => {
      const assigns = (t.user_tasks ?? [])
        .map(ut => {
          const u = ut.assigned_to;
          if (!u) return null;
          return {
            id: u.u_id ?? u.id ?? null,       // supports either column name
            name: u.u_name ?? u.name ?? null, // supports either column name
          };
        })
        .filter(a => a && a.id && a.name);

      return {
        ...t,
        index,
        time_spent: {
          h: hMap.get(t.t_id) ?? 0,
          min: mMap.get(t.t_id) ?? 0,
        },
        assigns,
        // Optional: keep legacy names array
        // assignNames: assigns.map(a => a.name),
        projectName: t.project?.p_name ?? null,
      };
    });

    return NextResponse.json(out, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
