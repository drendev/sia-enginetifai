
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const username = url.searchParams.get('username') ?? '';

        const checkEngine = await db.user.findUnique({
            where: {
                username: username,
            },
            select: {
                username: true,
            }
        });

        return NextResponse.json(checkEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
