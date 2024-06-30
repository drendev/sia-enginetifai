
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');

        const engineIdNumber = Number(engineId);

        const getEngineSpecification = await db.engine.findUnique({
            where: {
                id: engineIdNumber,
            },
            select: {
                specification: true,
            }
        });

        return NextResponse.json(getEngineSpecification);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
