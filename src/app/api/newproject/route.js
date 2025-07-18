import { prisma } from '@/lib/prisma'

export async function POST(req) {

    try {

        const body = await req.json()
        const { p_name, p_title, p_description, p_status_id, start_date, end_date, created_by_id, assigns } = body

        console.log(p_name);

        const existingProject = await prisma.project.findFirst({ where: { p_name } });

        if (existingProject) {
            return new Response(JSON.stringify({ error: 'Project Name already exists' }), { status: 400 })
        }
        console.log("Place 1");
        const NewProject = await prisma.project.create({
            data: {
                p_name,
                p_title,
                p_description,
                p_status_id,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                created_by_id,
            },
        })
        console.log("assigned users: ",assigns);
        for (const userId of assigns) {
            const NewUser_project = await prisma.user_Project.create({
                data: {
                    project_id: NewProject.p_id,
                    assigned_to_id: userId,
                },
            });
            console.log('New User_Project Created:', NewUser_project);
        }
        console.log('New Project Created:', NewProject);
        return new Response(JSON.stringify({ message: 'Project created', project: NewProject }), { status: 201 })
    } catch (err) {
        console.log('Error creating project:', err);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
    }
}
