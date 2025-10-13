// src/app/api/delete_task/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { select } from 'framer-motion/client';

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const json = Buffer.from(payload, 'base64url').toString('utf8'); // Node 16+
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function DELETE(request, context) {
  // ⬇️ params is a Promise — await it
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ message: 'Missing task id' }, { status: 400 })
  }

  const task_create_date = await prisma.task.findUnique({
    where: { t_id: id },
    select: { date_created: true }
  })

  // check permission
  if (new Date(task_create_date.date_created) < new Date(new Date().setDate(new Date().getDate() - 1))) {
    console.log("task created more than 1 day ago, check permission");
    const token = request.cookies.get('token')?.value;
    const claims = token ? decodeJwt(token) : null;
    console.log("claims in delete task: ", claims);
    if (claims.role == "3") {
      console.log("not authorized to delete this task");
      return NextResponse.json({ message: 'You are not authorized to delete this task' }, { status: 403 })
    }
  }

  console.log("task created date: ", task_create_date);
  console.log("yesterday: ", new Date(new Date().setDate(new Date().getDate() - 1)));

  try {
    await prisma.task.delete({
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
