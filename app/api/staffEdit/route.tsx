import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const FormSchema = z.object({
  userID: z.number(),
  username: z
    .string()
    .min(5, "Minimum 5 characters required.")
    .max(100)
    .refine((username) => username.trim().length > 0, {
      message: "Username is required",
    }),
  role: z.enum(["admin", "employee", "courier"]),
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Minimum 5 characters required.")
    .max(100)
    .refine((email) => email.trim().length > 0, {
      message: "Email is required",
    }),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("this is the body: ", body);
    const { userID, username, role, email, password } = FormSchema.parse(body);

    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const url = new URL(req.url);

    const getUser = await db.user.update({
      where: {
        id: userID,
      },
      data: {
        username,
        role,
        email,
        password: hashedPassword, // Store the hashed password
      },
    });
    console.log("this is the updated body: ", getUser);
    return NextResponse.json(getUser);
  } catch (error) {
    console.error("Error fetching user: ", error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
