import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Define schema
const transactionSchema = z.object({
  transactionUser: z.string().min(5, 'Username must be at least 5 characters.').max(30),
  engineNames: z.array(z.string()),
  quantity: z.array(z.number().min(1, 'Quantity is required').max(100)),
  delivery: z.boolean(),
  deliveryDate: z.string(),
  paymentMethod: z.string().min(5, 'Payment method must be at least 5 characters.').max(30)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionUser, engineNames, quantity, delivery, deliveryDate, paymentMethod } = transactionSchema.parse(body);

    const enginePrices = await db.engine.findMany({
      where: {
        engineName: {
          in: engineNames,
        },
      },
      select: {
        engineName: true,
        price: true,
      },
    });
    if (enginePrices.length !== engineNames.length) {
      return NextResponse.json({ message: 'One or more engines not found' }, { status: 404 });
    }
    
    const engineTotalPrice = engineNames.reduce((total, engineName, index) => {
      const engine = enginePrices.find(e => e.engineName === engineName);
        if (!engine) return total;
        total += engine.price * quantity[index];
      return total;
    }, 0);

    const newTransaction = await db.transaction.create({
      data: {
        transactionUser,
        engineName: engineNames,
        quantity: quantity,
        totalPrice: engineTotalPrice,
        delivery,
        deliveryDate,
        paymentMethod,
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
