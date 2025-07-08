import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('p_id');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        p_id: projectId,
      },
      include: {
        user_tasks: {
          include: {
            assigned_to: true, // get assigned user's data
          },
        },
        project: true,  // include related project data
      },
    });

    // Add `assigns` array with user names and `projectName` from project relation
    const tasksWithAssigns = tasks.map((task, index) => ({
      ...task, index,
      assigns: task.user_tasks.map(ut => ut.assigned_to.u_name),
      projectName: task.project?.p_name || null,
    }));

    return NextResponse.json(tasksWithAssigns);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
