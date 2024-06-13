
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { engineName } = body;
        
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
        if(!selectEngine) {
            return NextResponse.json({ message: 'Engine not found' }, { status: 404 });
        }

        return NextResponse.json(selectEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
