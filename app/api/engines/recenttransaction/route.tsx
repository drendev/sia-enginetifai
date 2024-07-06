import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const recentEngines = await db.engine.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            take: 3,
            select: {
                id: true,
                engineName: true,
                updatedAt: true,
                picture: true 
            }
        });

        const response = recentEngines.map(engine => ({
            engineId: engine.id,
            engineName: engine.engineName,
            engineAdded: engine.updatedAt,
            engineImage: engine.picture
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching recent engines:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
