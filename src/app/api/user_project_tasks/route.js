// src/app/api/tasks_by_user_and_project/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userIdRaw = searchParams.get('user_id');
  const projectIdRaw = searchParams.get('project_id');

  if (!userIdRaw || !projectIdRaw) {
    return NextResponse.json(
      { error: 'Missing user_id or project_id' },
      { status: 400 }
    );
  }

  // Cast if your schema uses Int
  const userId = isNaN(Number(userIdRaw)) ? userIdRaw : Number(userIdRaw);
  const projectId = isNaN(Number(projectIdRaw)) ? projectIdRaw : Number(projectIdRaw);

  try {
    // 1) Task links assigned to this user
    const links = await prisma.user_task.findMany({
      where: { assigned_to_id: userId },
      select: { related_to_id: true },
    });
    if (!links.length) return NextResponse.json([]);

    const taskIds = Array.from(new Set(links.map(l => l.related_to_id)));

    // 2) Fetch parent tasks for this project among those taskIds
    const tasks = await prisma.task.findMany({
      where: {
        t_id: { in: taskIds },
        p_id: projectId,
        parent_task_id: null,
      },
      include: {
        user_tasks: { include: { assigned_to: true } },
        project: true,
        added_by: true,
      },
    });
    if (!tasks.length) return NextResponse.json([]);

    const filteredTaskIds = tasks.map(t => t.t_id);

    // 3) Aggregate timesheets (two buckets)
    const [hoursAgg, minsAgg] = await Promise.all([
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: {
          taskId: { in: filteredTaskIds },
          duration: { lt: 10 }, // "h" bucket
        },
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: {
          taskId: { in: filteredTaskIds },
          duration: { gte: 10 }, // "min" bucket
        },
      }),
    ]);

    // 4) Build lookup maps
    const hMap = new Map(hoursAgg.map(r => [r.taskId, r._sum?.duration ?? 0]));
    const mMap = new Map(minsAgg.map(r => [r.taskId, r._sum?.duration ?? 0]));

    // 5) Attach computed fields + extras
    const out = tasks.map((task, index) => {
      const assigns = (task.user_tasks ?? [])
        .map(ut => {
          const u = ut.assigned_to;
          if (!u) return null;
          return {
            id: u.u_id ?? u.id ?? null,
            name: u.u_name ?? u.name ?? null,
          };
        })
        .filter(a => a && a.id && a.name);

      return {
        ...task,
        index,
        time_spent: {
          h: hMap.get(task.t_id) ?? 0,
          min: mMap.get(task.t_id) ?? 0,
        },
        assigns,
        // If you need backward-compat names array:
        // assignNames: assigns.map(a => a.name),
        projectName: task.project?.p_name ?? null,
      };
    });

    return NextResponse.json(out, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks by user and project:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
