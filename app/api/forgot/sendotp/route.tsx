import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const engineSchema = z.object({
    email: z.string().min(5, 'Engine Max Limit.').max(30),
})

export async function POST(req: Request) {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const body = await req.json();
        const { email } = engineSchema.parse(body);

        const getEmail = await db.user.findUnique({
            where: {
                email: email,
            },
            select: {
                email: true,
            }
        });

        if (!getEmail) {
            return
        }

        const getEngine = await db.user.update({
            where: {
                email: email,
            },
            data: {
                otp: otp,
            }
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            auth: {
                user: "forgot@enginetifai.com",
                pass: "841256WEW1aw!",
            },
        });

        try {
            const sent = await transporter.sendMail({
                from: 'EnginetifAI Forgot Password <forgot@enginetifai.com>',
                to: email,
                subject: 'Your OTP',
                text: 'Your EnginetifAI Verification Code',
                html: `<p>Forgot Password OTP <br> <br>
                Your EnginetifAI Verification Code is: <b>${otp}</b></p>`
            });

            return NextResponse.json(getEngine);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return NextResponse.json({ error: 'Error sending email' });
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
