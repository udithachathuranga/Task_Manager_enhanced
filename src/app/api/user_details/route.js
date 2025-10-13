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
        const user = await prisma.user.findUnique({
            where: { u_id: userId },
            select: {
                u_id: true,
                u_name: true,
                email: true,
                role: true
            }
        });
        if (user) {
            return NextResponse.json(user);
        } else {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
}