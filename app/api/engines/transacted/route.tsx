import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const recentEngines = await db.transaction.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            take: 4,
            select: {
                id: true,
                engineName: true,
                createAt: true,
                transactionUser: true,
                delivery: true,
                user: {
                    select: {
                        picture: true,
                    }
                }
            }
        });

        const response = recentEngines.map(engine => ({
            engineId: engine.id,
            engineName: engine.engineName,
            createAt: engine.createAt,
            transactionUser: engine.transactionUser,
            delivery: engine.delivery,
            user: engine.user.picture
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching recent engines:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
