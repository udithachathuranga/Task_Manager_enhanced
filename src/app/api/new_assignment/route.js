// app/api/new_assignment/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
    try {
        const { user_id, task_id } = await req.json()

        if (!user_id || !task_id) {
            return NextResponse.json({ error: 'Missing user_id or task_id' }, { status: 400 })
        }

        const exists = await prisma.user_Task.findFirst({
            where: {
                assigned_to_id: user_id,
                related_to_id: task_id,
            },
        });

        if (!exists) {
            const assignment = await prisma.user_Task.create({
                data: {
                    assigned_to_id: user_id,
                    related_to_id: task_id,
                    assigned_date: new Date(),
                },
            })
        }


        return NextResponse.json({ message: 'Assignment created' }, { status: 201 })
    } catch (err) {
        // Unique constraint violation (needs a unique index on (assigned_to_id, related_to_id))
        if (err?.code === 'P2002') {
            return NextResponse.json({ message: 'Assignment already exists' }, { status: 409 })
        }
        console.error('Error creating assignment:', err)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
