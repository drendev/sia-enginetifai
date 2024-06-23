import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request:Request) {
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                role: true,
            }
        });

        return new NextResponse(JSON.stringify(users), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
