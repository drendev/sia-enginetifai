import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const transactionId = url.searchParams.get('transactionId');
        const longitude = url.searchParams.get('longitude');
        const latitude = url.searchParams.get('latitude');

        const transactionIdNumber = Number(transactionId);
        const longitudeNumber = Number(longitude);
        const latitudeNumber = Number(latitude);

        if (isNaN(transactionIdNumber)) {
            return NextResponse.json({ error: 'Invalid Transaction ID' });
        }

        if (isNaN(longitudeNumber) || isNaN(latitudeNumber)) {
            return NextResponse.json({ error: 'Invalid Longitude or Latitude' });
        }

        const getTransaction = await db.transaction.update({
            where: {
                id: transactionIdNumber,
            },
            data: {
                deliveryInformation: {
                    update: {
                        longitude: longitudeNumber,
                        latitude: latitudeNumber,
                    }
                }
            }
        });

        if (!getTransaction) {
            return NextResponse.json({ error: 'Transaction not found' });
        }

        return NextResponse.json(getTransaction);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
