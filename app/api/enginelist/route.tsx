
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const engineNames = url.searchParams.getAll('engineName');



        const selectEngine = await db.engine.findMany({
            where: { 
                engineName: {
                    in: engineNames
            }},
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
