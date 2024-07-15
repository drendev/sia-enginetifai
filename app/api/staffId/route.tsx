
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');

        const engineIdNumber = Number(engineId);

        const getEngine = await db.engine.findUnique({
            where: {
                id: engineIdNumber,
            },
            select: {
                engineName: true,
                engineType: true,
                price: true,
                description: true,
                quantity: true,
                picture: true,
                userName: true,
            }
        });

        return NextResponse.json(getEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
