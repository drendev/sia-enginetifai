import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function getLastFullWeek() {
    const result = [];
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const startOfCurrentWeek = new Date(currentDate);
    startOfCurrentWeek.setDate(currentDate.getDate() - dayOfWeek - 7);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfCurrentWeek);
        date.setDate(startOfCurrentWeek.getDate() + i);
        result.push(date);
    }

    return result;
}

export async function POST() {
    try {
        // Get total sales for each day in the last full week
        const lastWeek = getLastFullWeek();
        const dailySalesPromises = lastWeek.map(async (date) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const totalSales = await db.transaction.aggregate({
                _sum: {
                    totalPrice: true,
                },
                where: {
                    createAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });
            return totalSales._sum.totalPrice || 0;
        });

        const dailySales = await Promise.all(dailySalesPromises);

        return NextResponse.json(dailySales);
    } catch (error) {
        console.error("Error fetching sales data:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
