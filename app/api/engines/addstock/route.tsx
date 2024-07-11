import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    quantity: z.number().min(1, 'Quantity is required').max(1000),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Convert quantity to a number
        const quantity = Number(body.quantity);

        // Validate the parsed quantity
        engineSchema.parse({ quantity });

        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');

        const engineIdNumber = Number(engineId);

        const getEngine = await db.engine.update({
            where: {
                id: engineIdNumber,
            },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
        });

        return NextResponse.json(getEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
