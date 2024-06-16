
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const engineNameFromUrl = url.searchParams.get('engineName');
        const engineName = engineNameFromUrl ? engineNameFromUrl : '';

        const selectEngine = await db.engine.findUnique({
            where: { engineName: engineName},
            select: {
                engineName: true,
                engineType: true,
                price: true,
                quantity: true,
                picture: true,
                description: true
            }
        });
        return NextResponse.json(selectEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
