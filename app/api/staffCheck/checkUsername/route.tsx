
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const username = url.searchParams.get('username') ?? '';

        const checkStaff = await db.user.findUnique({
            where: {
                username: username,
            },
            select: {
                username: true,
            }
        });

        return NextResponse.json(checkStaff);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
