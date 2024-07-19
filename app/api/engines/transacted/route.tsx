import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const recentEngines = await db.transaction.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            take: 4,
            select: {
                id: true,
                engineName: true,
                createAt: true,
                transactionUser: true,
                delivery: true,
                user: {
                    select: {
                        picture: true,
                    }
                }
            }
        });

        const arrayOfEngineNames = recentEngines.flatMap(engine => {
            if (typeof engine.engineName === 'string') {
                return [engine.engineName];
            } else if (Array.isArray(engine.engineName)) {
                return engine.engineName;
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

        const response = recentEngines.map(engine => {
            const engineNames = Array.isArray(engine.engineName) ? engine.engineName : [engine.engineName];
            const pictures = engineNames.flatMap(engineName => enginePictureMap[engineName] || []);
            return {
                engineId: engine.id,
                engineName: engine.engineName,
                createAt: engine.createAt,
                transactionUser: engine.transactionUser,
                delivery: engine.delivery,
                user: engine.user.picture,
                pictures: pictures
            };
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching recent engines:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
