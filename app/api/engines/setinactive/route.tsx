import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcrypt';

const engineSchema = z.object({
    engineId: z.number(),
    status: z.boolean()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { engineId, status } = engineSchema.parse(body);

        if(!engineId) {
            return
        }
        
        const updateEngineStatus = await db.engine.update({
            where: {
                id: engineId,
            },
            data: {
                status: status
            }
        });

        return NextResponse.json({ message: 'Password Successfully Changed' });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
