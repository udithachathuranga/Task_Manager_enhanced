import { prisma } from '@/lib/prisma'

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      t_id,              // Task ID to update
      t_title,
      t_description,
      due_date,
      date_created,
      time_estimate,
      priority,
      time_spent,
      task_status_id,
      p_id,
      added_by_id,
      parent_task_id,
      assigns            // New list of user IDs to assign
    } = body;

    console.log("Task to update:", body);

    // 1. Update Task
    const updatedTask = await prisma.task.update({
      where: { t_id },
      data: {
        t_title,
        t_description,
        due_date,
        date_created,
        time_estimate,
        priority,
        time_spent,
        task_status_id,
        p_id,
        added_by_id,
        parent_task_id,
      },
    });

    // 2. Delete previous assignments
    await prisma.user_Task.deleteMany({
      where: { related_to_id: t_id }
    });

    // 3. Create new assignments
    for (const userId of assigns) {
      await prisma.user_Task.create({
        data: {
          assigned: new Date(),
          related_to_id: t_id,
          assigned_to_id: userId
        }
      });
    }

    console.log('Task Updated:', updatedTask);
    return new Response(JSON.stringify({ message: 'Task updated', task: updatedTask }), { status: 200 });
  } catch (err) {
    console.error('Error updating task:', err);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
  }
}
