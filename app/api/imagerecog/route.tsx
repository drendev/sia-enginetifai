import { NextResponse } from 'next/server';
import { rekognition } from '@/lib/imagerekog';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    const buffer = Buffer.from(imageBase64, 'base64');

    if (!buffer) {
      return NextResponse.json({ message: 'Image is required.' }, { status: 400 });
    }
    
    const params = {
      Image: {
        Bytes: buffer,
      },
      ProjectVersionArn: 'arn:aws:rekognition:us-east-1:381492280590:project/enginetifai/version/enginetifai.2024-07-12T01.49.25/1720720166713', // Replace with your actual ARN
      MaxResults: 10,
      MinConfidence: 70,
    };

    const data = await rekognition.detectCustomLabels(params).promise();
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ message: 'Something went wrong.', error: error.message });
  }
}
