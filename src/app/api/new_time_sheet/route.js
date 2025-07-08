import { prisma } from '@/lib/prisma'

export async function POST(req) {

    try {

        const body = await req.json()
        const { taskId, date, duration } = body

        console.log("saving time sheet for date: ", date, " with duration: ", duration);

        const existingTask = await prisma.task.findFirst({ where: { t_id: taskId } });

        if (!existingTask) {
            return new Response(JSON.stringify({ error: 'Task does not exist' }), { status: 400 })
        }
        
        const NewTimeSheet = await prisma.timeSheet.create({
            data: {
                taskId,
                date: new Date(date),
                duration
            },
        })
        
        console.log('New time sheet Created:', NewTimeSheet);
        return new Response(JSON.stringify({ message: 'Time Sheet created', timeSheet: NewTimeSheet }), { status: 201 })
    } catch (err) {
        console.log('Error creating time sheet:', err);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
    }
}
