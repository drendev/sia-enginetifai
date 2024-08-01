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

        const getMap = await db.transaction.findUnique({
            where: {
                id: transactionIdNumber,
            },
            select: {
                deliveryInformation: {
                    select: {
                        latitude: true,
                        longitude: true,
                    },
                }
            }
        });

        if (!getMap) {
            return NextResponse.json({ error: 'No engine found with the specified ID' });
        }

        return NextResponse.json(getMap.deliveryInformation);  // directly return the transactions
    } catch (error) {
        console.error("Error fetching engine transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
