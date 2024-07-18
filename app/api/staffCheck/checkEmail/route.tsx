
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('email') ?? '';

        const checkStaff = await db.user.findUnique({
            where: {
                email: email,
            },
            select: {
                email: true,
            }
        });

        return NextResponse.json(checkStaff);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
