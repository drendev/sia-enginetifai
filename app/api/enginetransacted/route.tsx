
import z from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const engineTransactedSchema = z.object({
    quantity: z.number(),
    engineName: z.string()
})

export async function POST(req: Request) {  
    try {
        const body = await req.json();
        const { quantity, engineName } = engineTransactedSchema.parse(body);

        const currentQuantity = await db.engine.findUnique({
            where: { engineName },
            select: {
                quantity: true
            }
        })
        if (!currentQuantity) {
            return NextResponse.json({ message: 'Engine not found' }, { status: 404 });
        }

        const newQuantity = currentQuantity.quantity - quantity

        const updateQuantity = await db.engine.update({
            where: { engineName },
            data: {
                quantity: newQuantity
            }
         })

         return NextResponse.json({ message: "Success" })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}