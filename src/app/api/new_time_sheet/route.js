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
    const token = req.cookies.get('token')?.value;
    const claims = token ? decodeJwt(token) : null;
    console.log("Decoded JWT claims:", claims);

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
                duration,
                added_by_id: claims.userId
            },
        })

        NewTimeSheet.added_by = await prisma.user.findFirst({
            where: { u_id: NewTimeSheet.added_by_id },
            select: { u_id: true, u_name: true }
        });

        console.log('New time sheet Created:', NewTimeSheet);
        return new Response(JSON.stringify({ message: 'Time Sheet created', timeSheet: NewTimeSheet }), { status: 201 })
    } catch (err) {
        console.log('Error creating time sheet:', err);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
    }
}
