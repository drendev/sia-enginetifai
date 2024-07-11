
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const engineSchema = z.object({
    // Optional specification fields
    BorexStroke: z.string().optional(),
    Displacement: z.string().optional(),
    EngineSpeed: z.string().optional(),
    RatedOutput: z.string().optional(),
    MaxOutPut: z.string().optional(),
    LubeOilCapacity: z.string().optional(),
    FuelTankCapacity: z.string().optional(),
    FuelConsumption: z.string().optional(),
    Dimension: z.string().optional(),
    NetWeight: z.string().optional(),
    PackageDimension: z.string().optional(),
    GrossWeight: z.string().optional(),
    LoadingQty: z.string().optional(),
    RateACOutput: z.string().optional(),
    MaxACOutput: z.string().optional(),
    Noise: z.string().optional(),
    StartingSystem: z.string().optional(),
    Frequency: z.string().optional(),
    PowerFactor: z.string().optional(),
    EngineModel: z.string().optional(),
    DCOutput: z.string().optional(),
    Voltage: z.string().optional(),
    Inlet: z.string().optional(),
    MaxCapacity: z.string().optional(),
    MaxDischarge: z.string().optional(),
    SelfPrimingTime: z.string().optional(),
    MaxSuctionHead: z.string().optional(),
    Kw3600: z.string().optional(),
    Kw3000: z.string().optional(),
    Kw2600: z.string().optional(),
    MaxNetTorque: z.string().optional(),
    CompressionRatio: z.string().optional(),
    IdleSpeed: z.string().optional(),
    EngineOilCapacity: z.string().optional(),
    Size: z.string().optional(),
    ContinuousOpHours: z.string().optional(),
    Type: z.string().optional(),
    RunningTime: z.string().optional(),
    Optional: z.string().optional(),
    NoLoadVoltage: z.string().optional(),
    OperatingWelding: z.string().optional(),
    OperatingCurrent: z.string().optional(),
    MaxArcingCurrent: z.string().optional(),
    DutyCycle: z.string().optional(),
    EngineRatedPower: z.string().optional(),
    TillingWidth: z.string().optional(),
    TransmissionMode: z.string().optional(),
    PackingSize: z.string().optional(),
    TillingDepth: z.string().optional(),
    ShiftingGears: z.string().optional(),
    TransportingWheel: z.string().optional(),
    TillingBlades: z.string().optional(),
    ContLoad20: z.string().optional(),
    ContLoad40: z.string().optional(),
    NetPower: z.string().optional(),
    DisplacementBore: z.string().optional(),
    EngineType: z.string().optional(),
    Weight: z.string().optional(),
  });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsedBody = engineSchema.parse(body);

        const {
            ...specificationFields
          } = parsedBody;

        const url = new URL(req.url);
        const engineId = url.searchParams.get('engineId');

        const engineIdNumber = Number(engineId);

        const getEngine = await db.engine.update({
            where: {
                id: engineIdNumber
            },
            data: {
                specification: {
                    update: specificationFields
                }
            }
        });

        const getEngineSpecification = await db.engine.findUnique({
            where: {
                id: engineIdNumber,
            },
            select: {
                specification: true,
            }
        });
        if (getEngineSpecification && getEngineSpecification.specification) {
            const { id, engineName, engineId, ...specWithoutIds } = getEngineSpecification.specification;
            return NextResponse.json(specWithoutIds);
        }
        
        return NextResponse.json(getEngineSpecification?.specification);
    } catch (error) {
        console.error("Error fetching engine price:", error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
