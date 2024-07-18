import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { transactionId } = body;

        const transactionIdNumber = Number(transactionId);

        const getTransaction = await db.transaction.delete({
            where: {
                id: transactionIdNumber,
            },
        });

        if (!getTransaction) {
            return NextResponse.json({ error: 'Transaction not found' });
        }

        return NextResponse.json(getTransaction);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
