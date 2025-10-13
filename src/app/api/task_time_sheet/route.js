import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    console.log("Fetching timesheets for task ID vvvv:", taskId);
    if (!taskId) {
      return NextResponse.json({ error: 'Missing taskId' }, { status: 400 });
    }
    console.log("Fetching timesheets for task ID vvvv:", taskId);
    const timeSheets = await prisma.timeSheet.findMany({
      where: {
        taskId: taskId,
      },
      include: {
        added_by: true,
      },
      orderBy: {
        date: 'desc',
      },

    });

    return NextResponse.json(timeSheets, { status: 200 });
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json({ error: 'Failed to fetch timesheets' }, { status: 500 });
  }
}
