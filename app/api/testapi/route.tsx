
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const enginePrice = await db.user.findMany({
            select: {
                username: true,
                email: true,
                password: true,
                role: true,
            }
        });

        return NextResponse.json(enginePrice);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
