import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectIdRaw = searchParams.get('p_id');
  if (!projectIdRaw) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  // Cast if your schema uses Int for p_id
  const projectId = isNaN(Number(projectIdRaw)) ? projectIdRaw : Number(projectIdRaw);

  try {
    const [tasks, hoursAgg, minsAgg] = await Promise.all([
      prisma.task.findMany({
        where: { p_id: projectId, parent_task_id: null },
        include: {
          user_tasks: { include: { assigned_to: true } },
          project: true,
          added_by: true,
        },
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: {
          duration: { lt: 10 }, // "h" bucket
          task: { p_id: projectId },
        },
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: {
          duration: { gte: 10 }, // "min" bucket
          task: { p_id: projectId },
        },
      }),
    ]);

    const hMap = new Map(hoursAgg.map(r => [r.taskId, r._sum.duration ?? 0]));
    const mMap = new Map(minsAgg.map(r => [r.taskId, r._sum.duration ?? 0]));

    const tasksWithExtras = tasks.map((task, index) => {
      const assigns = (task.user_tasks ?? [])
        .map(ut => {
          const u = ut.assigned_to;
          if (!u) return null;
          return {
            id: u.u_id ?? u.id ?? null,     // supports either column name
            name: u.u_name ?? u.name ?? null,
          };
        })
        .filter(a => a && a.id && a.name);

      return {
        ...task,
        index,
        assigns,
        projectName: task.project?.p_name ?? null,
        time_spent: {
          h: hMap.get(task.t_id) ?? 0,
          min: mMap.get(task.t_id) ?? 0,
        },
      };
    });

    return NextResponse.json(tasksWithExtras);
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks by project' },
      { status: 500 }
    );
  }
}
