import { prisma } from '@/lib/prisma'

export async function POST(req) {
    try {
        console.log('testing text');
        const body = await req.json()
        const { t_title, t_description, due_date, date_created, time_estimate, priority, task_status_id, p_id, added_by_id, assigns } = body
        console.log('task status id: ', task_status_id);
        console.log(p_id);
        const NewTask = await prisma.task.create({
            data: {
                t_title,
                t_description,
                due_date,
                date_created,
                time_estimate,
                priority,
                task_status_id,
                p_id,
                added_by_id,
            },
        })

        if (assigns) {
            for (const userId of assigns) {
                const NewUser_task = await prisma.user_Task.create({
                    data: {
                        assigned: new Date(),
                        related_to_id: NewTask.t_id,
                        assigned_to_id: userId
                    },
                });
                console.log('New User_Task Created:', NewUser_task);
            }
        }

        console.log('New Task Created:', NewTask);

        return new Response(JSON.stringify({ message: 'Task created', task: NewTask }), { status: 201 })
    } catch (err) {
        console.log('Error creating task:', err);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
    }
}
