
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    address: z.string().min(5, 'Engine Max Limit.').max(100),
    deliveryUser: z.string().min(1, 'Price is required').max(100),
    deliveryTime: z.any(),
    longloc: z.number(),
    latloc: z.number(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { address, deliveryUser, deliveryTime, longloc, latloc} = engineSchema.parse(body);

        const url = new URL(req.url);
        const transactionId = url.searchParams.get('transactionId');

        const transactionIdNumber = Number(transactionId);

        const getDelivery = await db.transaction.update({
            where: {
                id: transactionIdNumber
            },
            data: {
                deliveryInformation: {
                    update: {
                        address: address,
                        deliverStatus: 'pending',
                        deliveryUser: deliveryUser,
                        deliveryTime: deliveryTime,
                        longloc: longloc,
                        latloc: latloc,
                    }
                }
            }
        });

        return NextResponse.json(getDelivery);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
