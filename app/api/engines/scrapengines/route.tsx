
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST() {
    
    try {
        const engineName = await db.scrap.findMany({
            select: {
                id: true,
                reason: true,
                user: true,
                createAt: true,
                quantity: true,
                engineName: true
            }
        });

        return NextResponse.json(engineName);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
