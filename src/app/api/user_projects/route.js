import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function decodeJwt(token) {
    try {
        const [, payload] = token.split('.');
        const json = Buffer.from(payload, 'base64url').toString('utf8'); // Node 16+
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export async function GET(req) {

    const token = req.cookies.get('token')?.value;
    const claims = token ? decodeJwt(token) : null;
    const userId = claims.userId;

    try {
        // Step 1: Get related project IDs from User_project
        const userProjectLinks = await prisma.user_Project.findMany({
            where: {
                assigned_to_id: userId,
            },
            select: {
                project_id: true, // project ID
            },
        });

        if (!userProjectLinks.length) {
            return NextResponse.json([]) // nothing assigned to this user
        }

        const userProjectIds = Array.from(new Set(userProjectLinks.map(l => l.project_id)))

        // Step 2: Fetch project
        const userProjects = await prisma.project.findMany({
            where: {
                p_id: { in: userProjectIds },
            },
        });

        if (!userProjects.length) {
            return NextResponse.json([])
        }

        return NextResponse.json(userProjects);
    } catch (error) {
        console.error("Error fetching user projects:", error);
        return NextResponse.json({ error: 'Failed to fetch user projects' }, { status: 500 });
    }
}
