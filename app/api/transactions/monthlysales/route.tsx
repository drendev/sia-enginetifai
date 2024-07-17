import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function POST() {
    try {
        const today = new Date();
        const last7Months = Array.from({ length: 7 }, (_, i) => {
            const date = subMonths(today, i);
            return {
                start: startOfMonth(date),
                end: endOfMonth(date)
            };
        });

        const salesByMonth = await Promise.all(last7Months.map(async ({ start, end }) => {
            const totalSales = await db.transaction.aggregate({
                _sum: {
                    totalPrice: true
                },
                where: {
                    createAt: {
                        gte: start,
                        lte: end
                    }
                }
            });
            return totalSales._sum.totalPrice || 0;
        }));

        return NextResponse.json(salesByMonth.reverse());
    } catch (error) {
        console.error("Error fetching sales data:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
