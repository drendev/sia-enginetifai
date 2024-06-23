
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const enginePrice = await db.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            password: true,
            role: true,
        }
    });

    return NextResponse.json(enginePrice);

}
