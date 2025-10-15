// src/app/api/parent_tasks/route.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [tasks, hoursAgg, minsAgg] = await Promise.all([
      prisma.task.findMany({
        where: { parent_task_id: null },
        include: {
          user_tasks: { include: { assigned_to: true } },
          project: true,
          added_by: true,
        },
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: { duration: { lt: 10 } }, // "h" bucket
      }),
      prisma.timeSheet.groupBy({
        by: ['taskId'],
        _sum: { duration: true },
        where: { duration: { gte: 10 } }, // "min" bucket
      }),
    ]);

    const hMap = new Map(hoursAgg.map(r => [r.taskId, r._sum.duration ?? 0]));
    const mMap = new Map(minsAgg.map(r => [r.taskId, r._sum.duration ?? 0]));

    const tasksWithExtra = tasks.map((t, index) => ({
      ...t,
      index,
      time_spent: {
        h: hMap.get(t.t_id) ?? 0,
        min: mMap.get(t.t_id) ?? 0,
      },
      // Return both id and name (handles either u_id/id and u_name/name)
      assigns: t.user_tasks
        .map(ut => {
          const u = ut.assigned_to;
          if (!u) return null;
          return {
            id: u.u_id ?? u.id ?? null,
            name: u.u_name ?? u.name ?? null,
          };
        })
        .filter(a => a && a.id && a.name),
      projectName: t.project?.p_name ?? null,
    }));

    return NextResponse.json(tasksWithExtra, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
