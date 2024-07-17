import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

        // Total number of transactions
        const totalTransactions = await db.transaction.count();

        // Transactions with delivery equal to true
        const transactionsWithDelivery = await db.transaction.count({
            where: {
                delivery: true
            }
        });

        // Pending transactions (deliveryDate is not today and in the future)
        const pendingTransactions = await db.transaction.count({
            where: {
                deliveryDate: {
                    gt: formattedToday // Use the formatted string
                }
            }
        });

        return NextResponse.json({
            totalTransactions,
            transactionsWithDelivery,
            pendingTransactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
