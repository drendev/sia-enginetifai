
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    engineType: z.string().min(8, 'Engine Type is required').max(100),
    price: z.number().min(1, 'Price is required').max(10000),
    picture: z.any(),
    description: z.string().min(5, 'Description is required').max(250),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { engineName, engineType, price, picture, description } = engineSchema.parse(body);

        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');

        const engineIdNumber = Number(engineId);

        const getEngine = await db.engine.update({
            where: {
                id: engineIdNumber
            },
            data: {
                price,
                engineName,
                engineType,
                picture,
                description
            }
        });

        return NextResponse.json(getEngine);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
