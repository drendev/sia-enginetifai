
import z from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connect } from 'http2';

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

            const enginePrice = await db.engine.findUnique({
              where: { engineName },
              select: {
                price: true
              }

            });
            const currentEngine = await db.engine.findUnique({
              where: { engineName },
              select: {
                quantity: true
              }
            });
      
            if (!currentEngine) {
              return
            }

            if(!enginePrice){
              return
            }

            if(currentEngine.quantity < quantity){
              return
            }
            const newQuantity = currentEngine.quantity - quantity;
            const totalPrice = enginePrice.price * quantity;

            const updateQuantity = await db.engine.update({
              where: { engineName },
              data: {
                quantity: newQuantity,
              }
            });
          
            const createTransac = await db.transactionEngine.create({
              data:{
                quantity: newQuantity,
                totalPrice: totalPrice,
                engine:{
                  connect: {
                    engineName: engineName
                  }
                }
              }
            })
          }

         return NextResponse.json({ message: "Success" })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}