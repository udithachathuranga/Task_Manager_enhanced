// src/app/api/delete_project/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.project.delete({
      where: { p_id: id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 });
  }
}
