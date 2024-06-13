"use client"

import z from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const imageSchema = z.object({
    picture: z.any(),
    username: z.string().min(3, 'Username is required').max(30),
})

export async function POST(req: Request) {  
    try {
        const body = await req.json();
        const { picture, username } = imageSchema.parse(body);

        const uploadImage = await db.user.update({
            where: { username },
            data: {
                picture
            }
         })

         return NextResponse.json({ message: "Success" })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}