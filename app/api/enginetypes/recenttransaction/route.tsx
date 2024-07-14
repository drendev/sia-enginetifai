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

        const enginesWithTransactions = await db.engine.findMany({
            where: {
                engineType: engineType
            },
            select: {
                id: true,
                engineType: true,
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

        if (!enginesWithTransactions.length) {
            return NextResponse.json({ message: "Engine type is required." }, { status: 400 })
        }

        const transactions = enginesWithTransactions.flatMap(engine => {
            if (Array.isArray(engine.transactions)) {
                return engine.transactions;
            } else {
                console.error(`Expected transactions to be an array, but got: ${typeof engine.transactions}`);
                return [];
            }
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}
