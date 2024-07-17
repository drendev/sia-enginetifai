import { db } from '@/lib/db';
import { create } from 'domain';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const dateSchema = z.object({
    date: z.string().min(1, 'Date is required').max(10000),
})

export async function POST(req: Request) {
    try {

    const body = await req.json();
    const { date } = dateSchema.parse(body);

    const getTransactions = await db.transaction.findMany({
        where: {
            deliveryDate: date
        },
        select: {
            id: true,
            delivery: true,
            paymentMethod: true,
            createAt: true,
            user: {
                select: {
                    picture: true,
                }
            }
        }
    })
    const response = getTransactions.map(transactions => ({
        id: transactions.id,
        delivery: transactions.delivery,
        createAt: transactions.createAt,
        user: transactions.user.picture,
        paymentMethod: transactions.paymentMethod
    }));

    return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
        
    }
}