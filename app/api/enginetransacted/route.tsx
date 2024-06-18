
import z from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const engineTransactionSchema = z.object({
    transactions: z.array(
      z.object({
        engineName: z.string(),
        quantity: z.number()
      })
    )
  });

export async function POST(req: Request) {  
    try {
        const body = await req.json();
        const { transactions } = engineTransactionSchema.parse(body);

        for (const transaction of transactions) {
            const { engineName, quantity } = transaction;
      
            const currentEngine = await db.engine.findUnique({
              where: { engineName },
              select: {
                quantity: true
              }
            });
      
            if (!currentEngine) {
              return NextResponse.json({ message: `Engine ${engineName} not found` }, { status: 404 });
            }
      
            const newQuantity = currentEngine.quantity - quantity;
      
            await db.engine.update({
              where: { engineName },
              data: {
                quantity: newQuantity
              }
            });
          }

         return NextResponse.json({ message: "Success" })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}