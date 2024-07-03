import z from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import moment from 'moment-timezone';

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
        const utcDate = new Date(); 
        const dateToday = moment.tz(utcDate, "Asia/Manila").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        const body = await req.json();
        const { transactions } = engineTransactionSchema.parse(body);

        const engineNames = transactions.map(transaction => transaction.engineName);

        const engines = await db.engine.findMany({
            where: {
                engineName: { in: engineNames }
            },
            select: {
                engineName: true,
                price: true,
                quantity: true
            }
        });

        const engineMap = new Map(engines.map(engine => [engine.engineName, engine]));

        const updates = [];
        const newTransactions = [];
        
        for (const transaction of transactions) {
            const { engineName, quantity } = transaction;
            const engine = engineMap.get(engineName);

            if (!engine) {
                return 
            }

            if (engine.quantity < quantity) {
                return 
            }

            const newQuantity = engine.quantity - quantity;
            const totalPrice = engine.price * quantity;

            updates.push({
                where: { engineName },
                data: { quantity: newQuantity }
            });

            newTransactions.push({
                quantity,
                totalPrice,
                createAt: dateToday,
                engine: {
                    connect: { engineName }
                }
            });
        }

        await db.$transaction([
            ...updates.map(update => db.engine.update(update)),
            ...newTransactions.map(transaction => db.transactionEngine.create({ data: transaction }))
        ]);

        return NextResponse.json({ message: "Success" });
    } catch (error) {
        console.error('Error occurred:', error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    } finally {
        await db.$disconnect();
    }
}
