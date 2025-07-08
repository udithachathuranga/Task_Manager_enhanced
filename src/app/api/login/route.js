export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { u_name, password } = await req.json();

    const user = await prisma.user.findFirst({ where: { u_name } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash_pwd);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.u_id, email: user.email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
    });

    return response;

  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}
