import { db } from '@/lib/db';
import { create } from 'domain';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
    user: z.string().min(1, 'Date is required').max(10000),
})

export async function POST(req: Request) {
    try {

    const body = await req.json();
    const { user } = userSchema.parse(body);

    const getTransactions = await db.transaction.findMany({
        where: {
            transactionUser: user,
        },
        select: {
            id: true,
            delivery: true,
            totalPrice: true,
            createAt: true,
            deliveryInformation: {
                select: {
                    deliverStatus: true,
                }
            }
        }
    })
    const response = getTransactions.map(transactions => ({
        id: transactions.id,
        delivery: transactions.delivery,
        createAt: transactions.createAt,
        totalPrice: transactions.totalPrice,
        deliveryStatus: transactions.deliveryInformation.flatMap(delivery => {
            return delivery.deliverStatus[0];
        }),
    }));

    return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
        
    }
}