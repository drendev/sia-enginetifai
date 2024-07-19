
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    address: z.string().min(5, 'Engine Max Limit.').max(100),
    city: z.string().min(1, 'Engine Type is required').max(100),
    deliveryUser: z.string().min(1, 'Price is required').max(100),
    deliveryTime: z.any(),
    longitude: z.number(),
    latitude: z.number(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { address, city, deliveryUser, deliveryTime, longitude, latitude } = engineSchema.parse(body);

        const url = new URL(req.url);
        const transactionId = url.searchParams.get('transactionId');

        const transactionIdNumber = Number(transactionId);

        const getDelivery = await db.transaction.update({
            where: {
                id: transactionIdNumber
            },
            data: {
                deliveryInformation: {
                    create: {
                        address: address,
                        city: city,
                        deliveryUser: deliveryUser,
                        deliveryTime: deliveryTime,
                        longitude,
                        latitude,
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
