import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, subDays, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function GET() {
    try {
        const timeZone = 'Asia/Manila';
        const now = toZonedTime(new Date(), timeZone)

        const todayStart = startOfDay(now);
        const todayEnd = setMilliseconds(setSeconds(setMinutes(setHours(startOfDay(now), 23), 59), 59), 999);
        const weekStart = startOfDay(subDays(now, 6));

        const todayStartUtc = toZonedTime(todayStart, timeZone);
        const todayEndUtc = toZonedTime(todayEnd, timeZone);
        const weekStartUtc = toZonedTime(weekStart, timeZone);

        const transactionsToday = await db.transaction.count({
            where: {
                createAt: {
                    gte: todayStart,
                    lte: todayEndUtc
                }
            }
        })

        const profitToday = await db.transaction.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                createAt: {
                    gte: todayStartUtc,
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
                gte: weekStartUtc,
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

        const today = transactionsToday;
        const profit = profitToday._sum.totalPrice;
        const averageWeeklyTransactions = (totalQuantity / 7).toFixed(2);
        const engineLowStockCount = engineStock;

        return NextResponse.json({today, profit, averageWeeklyTransactions, engineLowStockCount, enginesTotal});

    } catch (error) {
        console.error("Error fetching transaction count:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
