import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcrypt';

const engineSchema = z.object({
    email: z.string().min(5, 'Invalid Email.').max(30),
    password: z.string().min(8, 'Invalid Password.'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = engineSchema.parse(body);

        // Generate a salt

        // Hash the password with the salt
        const hashedPassword = await hash(password, 10)

        const updateUser = await db.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            }
        });

        return NextResponse.json({ message: 'Password Successfully Changed' });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
