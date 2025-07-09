import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust to your path
import bcrypt from 'bcrypt'

export async function GET() {
  try {
    // Example user
    const u_name = 'uditha';
    const email = 'udithachathuranga99@gmail.com';
    const password = '1234'; // 🔐 hash this before inserting
    const hash_pwd = await bcrypt.hash(password, 10);
    const role_id = '1';

    const user = await prisma.user.create({
      data: {
        u_name,
        email,
        role_id,
        hash_pwd,
      },
    });

    return NextResponse.json({ message: 'Admin created', user });
  } catch (err) {
    console.error("Admin creation error:", err); // 👈 log the real issue
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
