import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST() {
    try {
        const transactions = await db.transaction.findMany({
            select: {
                id: true,
                engineName: true,
                totalPrice: true,
                paymentMethod: true,
                deliveryDate: true,
                createAt: true,
            }
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
