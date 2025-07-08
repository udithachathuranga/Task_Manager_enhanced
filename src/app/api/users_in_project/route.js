import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  if (!projectId) {
    return NextResponse.json(
      { error: 'Missing project_id' },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.user_project.findMany({
      where: {
        project_id: projectId,
      },
      include: {
        assigned_to: true, // Fetch user details
      },
    });

    // Optional: Extract just the user list (not the full relation object)
    const userList = users.map((up, index) => up.assigned_to);

    return NextResponse.json(userList);
  } catch (error) {
    console.error('Error fetching users for project:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
