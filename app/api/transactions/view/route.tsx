import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const transactionId = url.searchParams.get('transactionId');

        const transactionIdNumber = Number(transactionId);

        const getTransaction = await db.transaction.findUnique({
            where: {
                id: transactionIdNumber,
            },
            select: {
                engineName: true,
                quantity: true,
                totalPrice: true,
                transactionUser: true,
                paymentMethod: true,
                delivery: true,
                deliveryDate: true,
                createAt: true,
                deliveryInformation: {
                    select: {
                        deliveryUser: true,
                        deliverStatus: true,
                        deliveryTime: true,
                        address: true,
                        city: true,
                    }
                }
            }
        });

        if (!getTransaction) {
            return NextResponse.json({ error: 'Transaction not found' });
        }

        const engineNames = Array.isArray(getTransaction.engineName) ? getTransaction.engineName : [getTransaction.engineName];

        const enginePictures = await db.engine.findMany({
            where: {
                engineName: {
                    in: engineNames
                }
            },
            select: {
                engineName: true,
                picture: true,
            }
        });

        const enginePictureMap = enginePictures.reduce((map, engine) => {
            if (!map[engine.engineName]) {
                map[engine.engineName] = [];
            }
            map[engine.engineName].push(engine.picture);
            return map;
        }, {} as Record<string, string[]>);

        const pictures = engineNames.flatMap(engineName => enginePictureMap[engineName] || []);

        const transactionWithPictures = {
            ...getTransaction,
            pictures: pictures,
            deliveryInformation: getTransaction.deliveryInformation
        };

        return NextResponse.json(transactionWithPictures);
    } catch (error) {
        console.error("Error fetching engine price and pictures:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
