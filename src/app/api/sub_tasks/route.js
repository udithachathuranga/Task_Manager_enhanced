// src/app/api/sub_tasks/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const parentTaskIdRaw = searchParams.get('parent_task_id');

  if (!parentTaskIdRaw) {
    return NextResponse.json({ error: 'Missing parent_task_id' }, { status: 400 });
  }

  // Cast to number if your DB column is Int; otherwise keep the string
  const parentTaskId = isNaN(Number(parentTaskIdRaw)) ? parentTaskIdRaw : Number(parentTaskIdRaw);

  try {
    // 1) Get child tasks for this parent
    const tasks = await prisma.task.findMany({
      where: { parent_task_id: parentTaskId },
      include: {
        user_tasks: { include: { assigned_to: true } },
        project: true,
        added_by: true,
      },
    });

    if (!tasks.length) return NextResponse.json([]);

    // 2) Aggregate timesheets for just these tasks
    const taskIds = tasks.map(t => t.t_id);

    const [hoursAgg, minsAgg] = await Promise.all([
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: {
          taskId: { in: taskIds },
          duration: { lt: 10 }, // "h" bucket
        },
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: {
          taskId: { in: taskIds },
          duration: { gte: 10 }, // "min" bucket
        },
      }),
    ]);

    // 3) Build lookup maps
    const hMap = new Map(hoursAgg.map(r => [r.taskId, r._sum?.duration ?? 0]));
    const mMap = new Map(minsAgg.map(r => [r.taskId, r._sum?.duration ?? 0]));

    // 4) Attach computed fields + extras
    const tasksWithExtras = tasks.map((task, index) => {
      const assigns = (task.user_tasks ?? [])
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
        ...task,
        index,
        time_spent: {
          h: hMap.get(task.t_id) ?? 0,
          min: mMap.get(task.t_id) ?? 0,
        },
        assigns,
        projectName: task.project?.p_name ?? null,
      };
    });

    return NextResponse.json(tasksWithExtras, { status: 200 });
  } catch (error) {
    console.error('Error fetching sub tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
