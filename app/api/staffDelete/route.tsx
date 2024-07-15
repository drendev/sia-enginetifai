
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userID } = body;


        const getUser = await db.user.delete({
            where: {
                id: userID
            },
        });
        

        if(!getUser) {
            return NextResponse.json({ error: 'Staff not found' });
        }

        return NextResponse.json(getUser);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
