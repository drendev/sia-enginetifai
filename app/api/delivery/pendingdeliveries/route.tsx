import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {

        const deliveries = await db.transaction.findMany({
            where: {
                deliveryInformation: {
                    deliverStatus: 'pending'
                }
            },
            select: {
                id: true,
                deliveryDate: true,
                transactionUser: true
            }
        });

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Error fetching engine pictures:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
