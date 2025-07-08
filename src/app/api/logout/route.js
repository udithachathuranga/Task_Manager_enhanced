import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  // Clear the cookie by setting it to empty and maxAge 0
  response.cookies.set('token', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
