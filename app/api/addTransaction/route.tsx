import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Define schema
const transactionSchema = z.object({
  transactionUser: z.string().min(5, 'Username must be at least 5 characters.').max(30),
  engineName: z.string().min(5, 'Engine name must be at least 5 characters.').max(30),
  quantity: z.number().min(1, 'Quantity is required').max(100),
  delivery: z.boolean(),
  deliveryDate: z.string(),
  paymentMethod: z.string().min(5, 'Payment method must be at least 5 characters.').max(30)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionUser, engineName, quantity, delivery, deliveryDate, paymentMethod } = transactionSchema.parse(body);

    const enginePrice = await db.engine.findUnique({
      where: { engineName },
      select: { price: true },
    });
    if (!enginePrice) {
      return NextResponse.json({ message: 'Engine not found' }, { status: 404 });
    }

    const engineTotalPrice = enginePrice.price * quantity;

    const newTransaction = await db.transaction.create({
      data: {
        transactionUser,
        engineName,
        quantity,
        totalPrice: engineTotalPrice,
        delivery,
        deliveryDate,
        paymentMethod
      },
    });

    return NextResponse.json({
      message: 'Transaction successfully added.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: `Something went wrong: ${error.message}` }, { status: 500 });
  }
}
