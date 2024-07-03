import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                role: true,
            }
        });

        const usersTotal = await db.user.count();


        return NextResponse.json({users, usersTotal});
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
