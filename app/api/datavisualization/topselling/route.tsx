
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const selectEngine = await db.engine.findMany({
            select: {
                engineName: true,
                picture: true,
                quantity: true,
                transactions: {
                    select: {
                        quantity: true
                    }
                }
            },
            orderBy:{
                transactions:{
                    _count: 'desc',
                }
            },
            take: 3
        });

        const engineDetails = selectEngine.map(engine => {
            const totalQuantity = engine.transactions.reduce((sum, transaction) => sum + transaction.quantity, 0);

            return {
                engineName: engine.engineName,
                picture: engine.picture,
                totalTransactionQuantity: totalQuantity,
            };
        });
        return NextResponse.json(engineDetails);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
