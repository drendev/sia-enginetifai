
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST() {
    try {
        const engineName = await db.engine.findMany({
            select: {
                engineName: true,
            }
        });

        return NextResponse.json(engineName);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
