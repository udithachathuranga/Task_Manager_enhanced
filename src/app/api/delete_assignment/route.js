// src/app/api/delete_project/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');
    const userId = searchParams.get('user_id');

    console.log("going to delete user Id: ", userId);
    console.log("going to delete task Id: ", taskId)

    try {
        await prisma.user_Task.deleteMany({
            where: {
                related_to_id: taskId,
                assigned_to_id: userId,
            },
        });

        return NextResponse.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to delete Assignment' }, { status: 500 });
    }
}
