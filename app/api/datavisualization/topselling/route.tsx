import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const engines = await db.engine.findMany({
            select: {
                engineName: true,
                picture: true,
                transactions: {
                    select: {
                        quantity: true
                    }
                }
            }
        });

        const enginesWithTotalQuantity = engines.map(engine => {
            const totalQuantity = engine.transactions.reduce((sum, transaction) => sum + transaction.quantity, 0);
            return {
                engineName: engine.engineName,
                picture: engine.picture,
                totalTransactionQuantity: totalQuantity,
            };
        });

        enginesWithTotalQuantity.sort((a, b) => b.totalTransactionQuantity - a.totalTransactionQuantity);

        const top3Engines = enginesWithTotalQuantity.slice(0, 3);

        return NextResponse.json(top3Engines);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
