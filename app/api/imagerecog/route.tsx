import { NextResponse } from 'next/server';
import { rekognition } from '@/lib/imagerekog';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    const buffer = Buffer.from(imageBase64, 'base64');

    const params = {
      Image: {
        Bytes: buffer,
      },
      MaxLabels: 10,
      MinConfidence: 70,
    };

      const data = await rekognition.detectLabels(params).promise();
      return NextResponse.json(data);

    } catch (error: any) {
      return NextResponse.json({ message: 'Something wrong.' });
    }
  
}