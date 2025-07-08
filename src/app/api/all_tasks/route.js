import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user_tasks: {
          include: {
            assigned_to: true, // includes the User object
          },
        },
        project: true,  // include the related project
      },
    });

    // Add "assigns" field with user names and "projectName" with project name
    const tasksWithExtra = tasks?.map((task,index) => ({  
      ...task,index,
      assigns: task.user_tasks.map((ut,index) => ut.assigned_to.u_name),
      projectName: task.project?.p_name || null,
    }));

    return NextResponse.json(tasksWithExtra);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
