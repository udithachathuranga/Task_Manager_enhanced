// src/app/api/delete_task/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request, context) {
  // ⬇️ params is a Promise — await it
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ message: 'Missing task id' }, { status: 400 })
  }

  try {
    await prisma.task.delete({
      // adjust this to your PK field (t_id vs id)
      where: { t_id: id }, 
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    // Prisma "record not found"
    if (error?.code === 'P2025') {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }
    console.error('DELETE /api/delete_task/[id] failed:', error)
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 })
  }
}
