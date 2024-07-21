import { NextResponse } from 'next/server';
import { rekognition } from '@/lib/imagerekog';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ message: 'Image is required.' }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, 'base64');

    if (!buffer) {
      return NextResponse.json({ message: 'Invalid image format.' }, { status: 400 });
    }
    
    const params = {
      Image: {
        Bytes: buffer,
      },
      ProjectVersionArn: 'arn:aws:rekognition:us-east-1:381492280590:project/enginetifai/version/enginetifai.2024-07-14T04.35.07/1720902907646',
      MaxResults: 10,
      MinConfidence: 80,
    };

    try {
      const data = await rekognition.detectCustomLabels(params).promise();
      return NextResponse.json(data);
    } catch (rekognitionError) {
      console.error('Rekognition Error:', rekognitionError);
      return NextResponse.json({ message: 'Rekognition detection failed.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('General Error:', error);
    return NextResponse.json({ message: 'Something went wrong.', error: error.message }, { status: 500 });
  }
}
