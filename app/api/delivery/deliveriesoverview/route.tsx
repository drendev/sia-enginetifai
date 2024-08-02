import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

        // Total number of transactions
        const totalDelivery = await db.transaction.count({
            where: {
                delivery: true
            }
        });

        // Transactions with delivery equal to true
        const delivered = await db.delivery.count({
            where: {
                deliverStatus: 'done'
            }
        });

        // Pending transactions (deliveryDate is not today and in the future)
        const pendingDelivery = await db.delivery.count({
            where: {
                deliverStatus: 'pending'
            }
        });

        return NextResponse.json({
            totalDelivery,
            delivered,
            pendingDelivery
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
