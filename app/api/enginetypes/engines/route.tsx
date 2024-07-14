import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { parse } from 'path';

const engineSchema = z.object({
    engineType: z.string().min(1, 'Quantity is required').max(1000),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { engineType } = engineSchema.parse(body);

        if (!engineType) {
            return NextResponse.json({ message: "Engine type is required." }, { status: 400 });
        }

        const engines = await db.engine.findMany({
            where: {
                engineType: engineType
            },
            select: {
                id: true,
                picture: true,
                engineName: true,
                quantity: true,
            }
        });

        const response = engines.map(engine => ({
            engineId: engine.id,
            engineName: engine.engineName,
            quantity: engine.quantity,
            engineImage: engine.picture,
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching engines:", error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}
