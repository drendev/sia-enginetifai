import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Define schema
const engineSchema = z.object({
  userName: z.string().min(5, 'Username Max Limit.').max(30),
  engineName: z.string().min(5, 'Engine Max Limit.').max(30),
  engineType: z.string().min(8, 'Engine Type is required').max(100),
  price: z.number().min(1, 'Price is required').max(10000),
  quantity: z.number().min(1, 'Quantity is required').max(100),
  picture: z.any(),
  description: z.string().min(5, 'Description is required').max(250),
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
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = engineSchema.parse(body);

    const {
      userName,
      engineName,
      engineType,
      price,
      quantity,
      picture,
      description,
      ...specificationFields
    } = parsedBody;

    const newEngine = await db.engine.create({
      data: {
        userName,
        engineName,
        engineType,
        price,
        quantity,
        picture,
        description,
        specification: {
          create: specificationFields,
        },
      },
    });

    return NextResponse.json(
      { message: 'Engine added successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
