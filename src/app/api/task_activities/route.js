import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json(
      { error: 'Missing task_id' },
      { status: 400 }
    );
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        related_task_id: taskId,
      },
      include: {
        done_by: true,
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities for task:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
