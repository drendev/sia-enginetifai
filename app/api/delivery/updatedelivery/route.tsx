import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const transactionId = url.searchParams.get('transactionId');
        const transactionStatus = url.searchParams.get('status');
        const transactionIdNumber = Number(transactionId);

        if (isNaN(transactionIdNumber)) {
            return NextResponse.json({ error: 'Invalid Transaction ID' });
        }

        const updateDelivery = await db.transaction.update({
            where: {
                id: transactionIdNumber
            },
            data: {
                deliveryInformation: {
                    update: {
                        deliverStatus: transactionStatus
                    }
                }
            }
        })

        if (!updateDelivery) {
            return NextResponse.json({ error: 'No engine found with the specified ID' });
        }

        return NextResponse.json(updateDelivery);  // directly return the transactions
    } catch (error) {
        console.error("Error fetching engine transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
