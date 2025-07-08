import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req) {
  try {
    const body = await req.json()
    console.log("body", body)
    const { u_name, email, password, role_id } = body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 })
    }

    const hash_pwd = await bcrypt.hash(password, 10)
    console.log(typeof hash_pwd);
    console.log("before creating user");

    const newUser = await prisma.user.create({
      data: {
        u_name,
        email,
        role_id,
        hash_pwd,
      },
    })
    console.log("newUser", newUser)
    return new Response(JSON.stringify({ message: 'User created', user: newUser }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
  }
}
