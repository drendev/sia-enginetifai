import { NextResponse } from 'next/server'
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { z } from 'zod';

// Define schema
const userSchema = z
  .object({
    username: z.string().min(3, 'Username is required').max(30),
    email: z.string().min(8, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),  
    role: z.string().min(1, 'Username is required').max(100),
  })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password, role } = userSchema.parse(body);

        // check if email is already in use
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email}
        })
        const existingUserByUsername = await db.user.findUnique({
            where: { username: username}
        })

        if(existingUserByEmail){
            return NextResponse.json({user: null, message: 'Email already in use'}, { status: 409 })
        }
        if(existingUserByUsername){
            return NextResponse.json({user: null, message: 'User already exist'}, { status: 409 })
        }
        const hashedPassword = await hash(password, 10)

        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role
            }
        });
        const {password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({
            user: rest, 
            message: 'User created'},
            {status: 201}
        )
    }
    catch(error){
        return NextResponse.json({ message: "Something went wrong."}, { status: 500 })
    }
}