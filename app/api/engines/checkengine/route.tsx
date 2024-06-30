
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const engineName = url.searchParams.get('engineName') ?? '';

        const checkEngine = await db.engine.findUnique({
            where: {
                engineName: engineName,
            },
            select: {
                engineName: true,
            }
        });

        return NextResponse.json(checkEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
