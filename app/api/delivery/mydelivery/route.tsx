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

    const getDeliveryData = await db.transaction.findMany({
        where: {
            deliveryInformation: {
                deliveryUser: user,
                deliverStatus: 'pending'
            }
        },
        select: {
            id: true,
            deliveryDate: true,
            deliveryInformation: {
                select: {
                    deliveryTime: true,
                }
            }  
        }
    })

    const response = getDeliveryData.map(delivery => ({
        id: delivery.id,
        deliveryDate: delivery.deliveryDate,
        deliveryTime: delivery.deliveryInformation?.deliveryTime
    }));
    
    return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
        
    }
}