import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import moment from 'moment-timezone';

export async function GET() {
    try {
        const timeZone = 'Asia/Manila';

        const currentDay = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        const todayStart = new Date(formatter.format(new Date(currentDay.setHours(0, 0, 0, 0))));
        const todayEnd = new Date(formatter.format(new Date(currentDay.setHours(23, 59, 59, 999))));
        const weekStart = new Date(formatter.format(new Date(currentDay.setDate(currentDay.getDate() - 6))));

        const transactionsToday = await db.transaction.count({
            where: {
                createAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        })

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
