import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export async function GET() {
    try {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const weekStart = startOfDay(subDays(todayEnd, 6));

        const transactionsToday = await db.transaction.aggregate({
            _count: {
                quantity: true 
            },
            where: {
                createAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        });

        const profitToday = await db.transaction.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                createAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        });

        const totalTransactions = await db.transactionEngine.aggregate({
            _sum: {
              quantity: true
            },
            where: {
              createAt: {
                gte: weekStart,
                lte: todayEnd
              }
            }
          });

        const engineStock = await db.engine.count({
            where: {
                quantity: {
                    lt: 10
                }
            }
        })
        const enginesTotal = await db.engine.count();

        const totalQuantity = totalTransactions._sum.quantity || 0;

        const today = transactionsToday._count.quantity;
        const profit = profitToday._sum.totalPrice;
        const averageWeeklyTransactions = (totalQuantity / 7).toFixed(2);
        const engineLowStockCount = engineStock;

        return NextResponse.json({today, profit, averageWeeklyTransactions, engineLowStockCount, enginesTotal});

    } catch (error) {
        console.error("Error fetching transaction count:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
