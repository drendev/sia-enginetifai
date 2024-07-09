import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');
        const engineIdNumber = Number(engineId);

        if (isNaN(engineIdNumber)) {
            return NextResponse.json({ error: 'Invalid Engine ID' });
        }

        const engine = await db.engine.findUnique({
            where: {
                id: engineIdNumber,
            },
            select: {
                transactions: {
                    select: {
                        id: true,
                        quantity: true,
                        totalPrice: true,
                        createAt: true,
                    },
                    take: 4,
                }
            }
        });

        if (!engine) {
            return NextResponse.json({ error: 'No engine found with the specified ID' });
        }

        return NextResponse.json(engine.transactions);  // directly return the transactions
    } catch (error) {
        console.error("Error fetching engine transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
