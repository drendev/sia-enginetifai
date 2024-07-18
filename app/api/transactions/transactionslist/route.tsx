import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {

        const transactions = await db.transaction.findMany({
            select: {
                id: true,
                engineName: true,
                totalPrice: true,
                paymentMethod: true,
                deliveryDate: true,
                createAt: true,
            }
        });

        const arrayOfEngineNames: string[] = transactions.flatMap(transaction => {
            if (typeof transaction.engineName === 'string') {
                return [transaction.engineName];
            } else if (Array.isArray(transaction.engineName)) {
                return transaction.engineName;
            }
            return [];
        });

        const enginePictures = await db.engine.findMany({
            where: {
                engineName: {
                    in: arrayOfEngineNames
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

        const transactionsWithPictures = transactions.map(transaction => {
            const engineNames = Array.isArray(transaction.engineName) ? transaction.engineName : [transaction.engineName];
            const pictures = engineNames.flatMap(engineName => enginePictureMap[engineName] || []);
            return {
                ...transaction,
                picture: pictures
            };
        });

        return NextResponse.json(transactionsWithPictures);
    } catch (error) {
        console.error("Error fetching engine pictures:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
