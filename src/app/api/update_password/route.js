import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt';

function decodeJwt(token) {
    try {
        const [, payload] = token.split('.');
        const json = Buffer.from(payload, 'base64url').toString('utf8'); // Node 16+
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export async function PUT(req) {

    try {
        const body = await req.json();
        const { currentPassword, newPassword } = body;

        console.log("passwords to update:", body);

        const token = req.cookies.get('token')?.value;
        const claims = token ? decodeJwt(token) : null;

        const existingPassword = await prisma.user.findFirst({ where: { u_id: claims.userId } }, {include: { hash_pwd: true }} );
        console.log("existing password hash: ", existingPassword);
        const isPasswordValid = await bcrypt.compare(currentPassword, existingPassword.hash_pwd);

        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Current password is incorrect' }), { status: 400 });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        console.log("hashed new password: ", hashedNewPassword);
        console.log("claims: ", claims);

        const updatedUser = await prisma.user.update({
            where: { u_id: claims.userId },
            data: { hash_pwd: hashedNewPassword },
        });

        return new Response(JSON.stringify({ message: 'Password updated', user: updatedUser }), { status: 200 });

    } catch (err) {
        console.error('Error updating user:', err);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}
