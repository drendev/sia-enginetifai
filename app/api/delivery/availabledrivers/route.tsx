
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST() {
    try {
        const deliveryUser = await db.user.findMany({
            where: {
                role: 'courier'
            },
            select: {
                id: true,
                username: true
            }
        });

        return NextResponse.json(deliveryUser);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
