import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

export async function POST() {
    try {
        const timeZone = 'Asia/Manila';

        const utcDate = new Date();

        const todayStart = moment.tz(utcDate, timeZone).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        const todayEnd = moment.tz(utcDate, timeZone).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        
        const weekStart = moment.tz(utcDate, timeZone).startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        
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
