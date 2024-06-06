import { NextResponse } from 'next/server'
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { z } from 'zod';

// Ito yung nag hahandle ng errors sa pag add ng transaction sa database
const transactionSchema = z
  .object({
    transactionUser: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    totalPrice: z.number().min(1, 'Price is required').max(10000),
    quantity: z.number().min(1, 'Quantity is required').max(100),
    delivery: z.boolean(),
    deliveryDate: z.date(),
    description: z.string().min(5, 'Description is required').max(250),
  })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
             transactionUser, 
             engineName, 
             totalPrice, 
             quantity,
             delivery,
             deliveryDate } = transactionSchema.parse(body);

        // check if engine is in use

        const newTransaction = await db.transaction.create({
            data: {
                transactionUser,
                engineName,
                quantity,
                totalPrice,
                delivery,
                deliveryDate
            }
        });

        return NextResponse.json({
            message: 'Transaction successfully added.'},
            {status: 201}
        )
    }
    catch(error){
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}