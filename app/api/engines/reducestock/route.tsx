import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment-timezone';

const engineSchema = z.object({
    quantity: z.number().min(1, 'Quantity is required').max(1000),
    reason: z.string().min(1, 'Reason is required').max(50),
    user: z.string().min(1, 'User is required'),
    engineName: z.string().min(1, 'Engine Name is required'),
});
const utcDate = new Date();
    const timeZone = 'Asia/Manila';

    const dateToday = moment.tz(utcDate, timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Convert quantity to a number
        const quantity = Number(body.quantity);
        const reason = body.reason;
        const user = body.user;
        const engineName = body.engineName;

        // Validate the parsed quantity
        engineSchema.parse({ quantity, reason, user, engineName });

        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');

        const engineIdNumber = Number(engineId);

        const reduceEngine = await db.engine.update({
            where: {
                id: engineIdNumber,
            },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });

        const getEngine = await db.scrap.create({
            data: {
                quantity: quantity,
                reason: reason,
                user: user,
                engineName: engineName,
                createAt: dateToday
            },
        });

        return NextResponse.json(reduceEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
