import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        const getMap = await db.transaction.findUnique({
            where: {
                id: id
            },
            select: {
                deliveryInformation: {
                    select: {
                        longitude: true,
                        latitude: true
                    }
                }
            }
        })

        if (!getMap) {
            return NextResponse.json({ error: 'Transaction not found' });
        }

        return NextResponse.json(getMap.deliveryInformation);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
