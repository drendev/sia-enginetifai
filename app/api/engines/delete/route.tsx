
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { engineName } = body;

        const getEngine = await db.engine.delete({
            where: {
                engineName: engineName,
            }
        });
        

        if(!getEngine) {
            return NextResponse.json({ error: 'Engine not found' });
        }

        return NextResponse.json(getEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
