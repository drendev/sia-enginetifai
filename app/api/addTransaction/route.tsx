import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

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
    console.log('Request body:', body);

    const { transactionUser, engineNames, quantity, delivery, deliveryDate, paymentMethod } = transactionSchema.parse(body);
    console.log('Parsed data:', { transactionUser, engineNames, quantity, delivery, deliveryDate, paymentMethod });

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
    console.log('Engine prices from DB:', enginePrices);

    const priceMap = new Map(enginePrices.map(engine => [engine.engineName, engine.price]));
    console.log('Price map:', priceMap);
    
    if (priceMap.size !== engineNames.length) {
      return NextResponse.json({ message: 'One or more engines not found' }, { status: 404 });
    }

    let engineTotalPrice = 0;
    for (let i = 0; i < engineNames.length; i++) {
      const price = priceMap.get(engineNames[i]);
      if (price === undefined) {
        return NextResponse.json({ message: 'One or more engines not found' }, { status: 404 });
      }
      engineTotalPrice += price * quantity[i];
    }
    console.log('Total price calculated:', engineTotalPrice);

    const newTransaction = await db.transaction.create({
      data: {
        transactionUser,
        engineName: engineNames,
        quantity,
        totalPrice: engineTotalPrice,
        delivery,
        deliveryDate,
        paymentMethod,
      },
    });
    console.log('New transaction added:', newTransaction);

    return NextResponse.json({
      message: 'Transaction successfully added.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: `Something went wrong: ${error.message}` }, { status: 500 });
  }
}
