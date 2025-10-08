// app/api/new_assignment/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
    try {
        const { sender_id, message, related_task_id } = await req.json()

        if (!sender_id || !message || !related_task_id) {
            return NextResponse.json({ error: 'Missing sender_id or message or related_to_id' }, { status: 400 })
        }
 
        console.log("before create:",sender_id,",",message,",",related_task_id);

        const comment = await prisma.comment.create({
            data: {
                sender_id: sender_id,
                date: new Date(),
                message: message,
                related_task_id: related_task_id,
            },
        })

        const sender = await prisma.user.findUnique({
            where: { u_id: sender_id },
        });

        comment.sender = sender;

        return NextResponse.json({ message: 'Comment created.',comment: comment }, { status: 201 })
    } catch (err) {
        // Unique constraint violation (needs a unique index on (assigned_to_id, related_to_id))
        if (err?.code === 'P2002') {
            return NextResponse.json({ message: 'Assignment already exists' }, { status: 409 })
        }
        console.error('Error creating assignment:', err)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
