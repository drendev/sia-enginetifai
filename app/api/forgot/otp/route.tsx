import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    email: z.string().min(5, 'Invalid Email.').max(30),
    otp: z.string().min(1, 'Invalid OTP.'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, otp } = engineSchema.parse(body);

        const getEmail = await db.user.findUnique({
            where: {
                email: email,
            },
            select: {
                otp: true,
            }
        });

        if (!getEmail) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 });
        }

        console.log(getEmail.otp);

        if (getEmail.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
        }

        await db.user.update({
            where: { email: email },
            data: { otp: null },
        });

        return NextResponse.json({ message: 'OTP verified successfully' });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
