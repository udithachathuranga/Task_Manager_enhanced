import { prisma } from '@/lib/prisma'

function decodeJwt(token) {
    try {
        const [, payload] = token.split('.');
        const json = Buffer.from(payload, 'base64url').toString('utf8'); // Node 16+
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { t_title, t_description, due_date, date_created, time_estimate, priority, task_status_id, p_id, added_by_id, assigns, parent_task_id } = body
        console.log('task status id: ', task_status_id);
        console.log("task before create: ", body);

        const token = req.cookies.get('token')?.value;
        const claims = token ? decodeJwt(token) : null;

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
                parent_task_id
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

        if(NewTask){
            await prisma.activity.create({
                data: {
                    done_by_id: claims.userId,
                    related_task_id: NewTask.t_id,
                    content: "created this task.",
                    date: new Date()
                },
            });
        }

        const project = await prisma.project.findUnique({
            where: { p_id: p_id },
        });
        NewTask.project = project;

        console.log('New Task Created:', NewTask);

        return new Response(JSON.stringify({ message: 'Task created', task: NewTask }), { status: 201 })
    } catch (err) {
        console.log('Error creating task:', err);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
    }
}
