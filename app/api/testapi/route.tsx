import { PrismaClient, Prisma } from '@prisma/client'
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET() {
    try {
        const enginePrice = await prisma.user.findMany({
            select: {
                username: true,
                email: true,
                password: true,
                role: true,
            }
        });

        return NextResponse.json(enginePrice);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
