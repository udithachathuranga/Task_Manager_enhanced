// src/app/api/delete_project/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;
  console.log("Deleting project with ID:", id);

  try {
    await prisma.task.delete({
      where: { t_id: id },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
  }
}
