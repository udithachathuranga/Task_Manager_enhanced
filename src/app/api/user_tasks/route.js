import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function decodeJwt(token) {
    try {
        const [, payload] = token.split('.');
        const json = Buffer.from(payload, 'base64url').toString('utf8'); // Node 16+
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export async function GET(req) {

  const token = req.cookies.get('token')?.value;
  const claims = token ? decodeJwt(token) : null;
  const userId = claims.userId;

  try {
    // Step 1: Get related task IDs from User_task
    const userTaskLinks = await prisma.user_Task.findMany({
      where: {
        assigned_to_id: userId,
      },
      select: {
        related_to_id: true, // task ID
      },
    });

    if (!userTaskLinks.length) {
      return NextResponse.json([]) // nothing assigned to this user
    }

    const taskIds = Array.from(new Set(userTaskLinks.map(l => l.related_to_id)))

    // Step 2: Fetch Task objects, their assigned users, and related project
    const tasks = await prisma.task.findMany({
      where: {
        t_id: { in: taskIds },
        parent_task_id: null // only top-level tasks
      },
      include: {
        user_tasks: {
          include: {
            assigned_to: true, // fetch assigned user's full details
          },
        },
        project: true, // include related project
        added_by: true // include user who added the task
      },
    });

    if (!tasks.length) {
      return NextResponse.json([])
    }

    // Step 3: Add `assigns` field with user names and projectName
    const tasksWithAssigns = tasks.map((task, index) => ({
      ...task, index,
      assigns: task.user_Tasks?.map((ut, index) => ut.assigned_to.u_name) || [],
      projectName: task.project?.p_name || null,
    }));

    return NextResponse.json(tasksWithAssigns);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
