import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, addDays, endOfDay, endOfWeek } from 'date-fns';

export async function POST() {
  try {
    const today = new Date();
    const currentMonth = {
      start: startOfMonth(today),
      end: today,
    };
    const lastMonth = {
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
    };

    const calculateTransactionAverages = async ({ start, end }: { start: Date, end: Date }) => {
      const days = eachDayOfInterval({ start, end });
      const weeks = eachWeekOfInterval({ start, end });

      // Parallelize daily transactions count
      const dailyTransactionCounts = await Promise.all(days.map(day => 
        db.transaction.count({
          where: {
            delivery: true,
            createAt: {
              gte: day,
              lt: endOfDay(day),
            },
          },
        })
      ));
      const totalDailyTransactions = dailyTransactionCounts.reduce((sum, count) => sum + count, 0);

      // Parallelize weekly transactions count
      const weeklyTransactionCounts = await Promise.all(weeks.map(weekStart => 
        db.transaction.count({
          where: {
            delivery: true,
            createAt: {
              gte: weekStart,
              lt: endOfWeek(weekStart),
            },
          },
        })
      ));
      const totalWeeklyTransactions = weeklyTransactionCounts.reduce((sum, count) => sum + count, 0);

      const dailyAverage = totalDailyTransactions / days.length;
      const weeklyAverage = totalWeeklyTransactions / weeks.length;

      return { dailyAverage, weeklyAverage };
    };

    const [currentMonthAverages, lastMonthAverages] = await Promise.all([
      calculateTransactionAverages(currentMonth),
      calculateTransactionAverages(lastMonth)
    ]);

    const dailyPercentageChange = lastMonthAverages.dailyAverage !== 0
      ? ((currentMonthAverages.dailyAverage - lastMonthAverages.dailyAverage) / lastMonthAverages.dailyAverage) * 100
      : currentMonthAverages.dailyAverage !== 0 ? 100 : 0;

    const weeklyPercentageChange = lastMonthAverages.weeklyAverage !== 0
      ? ((currentMonthAverages.weeklyAverage - lastMonthAverages.weeklyAverage) / lastMonthAverages.weeklyAverage) * 100
      : currentMonthAverages.weeklyAverage !== 0 ? 100 : 0;

    return NextResponse.json({
      dailyPercentageChange: dailyPercentageChange.toFixed(2),
      weeklyPercentageChange: weeklyPercentageChange.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
