
import { db } from '@/lib/db';
import Password from 'antd/es/input/Password';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    email: z.string().min(5, 'Engine Max Limit.').max(30),
    username: z.string().min(5, 'Engine Max Limit.').max(30),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username } = engineSchema.parse(body);

        const getEngine = await db.user.update({
            where: {
                username: username
            },
            data: {
                email: email,
                username: username,
            }
        });

        return NextResponse.json(getEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
