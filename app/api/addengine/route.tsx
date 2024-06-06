import { NextResponse } from 'next/server'
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { z } from 'zod';

// Define schema
const engineSchema = z
  .object({
    userName: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    engineType: z.string().min(8, 'Engine Type is required').max(100),
    price: z.number().min(1, 'Price is required').max(100),
    quantity: z.number().min(1, 'Quantity is required').max(100),
    picture: z.string().min(5, 'Picture is required').max(100),
    description: z.string().min(5, 'Description is required').max(250),
  })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userName, engineName, engineType, price, quantity, picture, description } = engineSchema.parse(body);

        // check if engine is in use
        const existingEngine = await db.engine.findUnique({
            where: { engineName: engineName}
        })

        if(existingEngine){
            return NextResponse.json({user: null, message: 'Engine already existed.'}, { status: 409 })
        }

        const newEngine = await db.engine.create({
            data: {
                userName,
                engineName,
                engineType,
                price,
                quantity,
                picture,
                description,
            }
        });

        return NextResponse.json({
            message: 'Engine added successfully.'},
            {status: 201}
        )
    }
    catch(error){
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}