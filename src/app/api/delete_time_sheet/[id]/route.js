// src/app/api/delete_project/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.timeSheet.delete({
      where: { tSheetId: id },
    });

    return NextResponse.json({ message: 'Time Sheet deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete time sheet' }, { status: 500 });
  }
}
