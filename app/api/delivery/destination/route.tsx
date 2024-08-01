import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const transactionId = url.searchParams.get('transactionId');
        const transactionIdNumber = Number(transactionId);

        if (isNaN(transactionIdNumber)) {
            return NextResponse.json({ error: 'Invalid Transaction ID' });
        }

        const transaction = await db.transaction.findUnique({
            where: {
                id: transactionIdNumber,
            },
            select: {
                deliveryInformation: {
                    select: {
                        longloc: true,
                        latloc: true,
                    },
                }
            }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'No engine found with the specified ID' });
        }

        return NextResponse.json(transaction.deliveryInformation);  // directly return the transactions
    } catch (error) {
        console.error("Error fetching engine transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
