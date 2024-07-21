import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { longitude, latitude } = body;

        const getTransaction = await db.delivery.update({
            where: {
                id: 23,
            },
            data: {
                longitude: longitude,
                latitude: latitude
            }
        })

        if (!getTransaction) {
            return NextResponse.json({ error: 'Transaction not found' });
        }

        return NextResponse.json(getTransaction);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
