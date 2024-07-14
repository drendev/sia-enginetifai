import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const engineSchema = z.object({
    engineType: z.string().min(1, 'Quantity is required').max(1000),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { engineType } = engineSchema.parse(body);

        if (!engineType) {
            return NextResponse.json({ message: "Engine type is required." }, { status: 400 });
        }

        const engines = await db.engine.findMany({
            where: {
                engineType: engineType
            },
            select: {
                transactions: {
                    select: {
                        id: true,
                        quantity: true,
                        totalPrice: true,
                        createAt: true
                    },
                    take: 3
                }
            }
        });

        if (!engines || engines.length === 0) {
            return NextResponse.json({ error: 'No engine found with the specified type' });
        }

        const response = engines.flatMap(engine => 
            engine.transactions.map(transaction => ({
                totalPrice: transaction.totalPrice,
                transactionId: transaction.id,
                transactionDate: transaction.createAt,
                quantity: transaction.quantity
            }))
        );

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching engines:", error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}
