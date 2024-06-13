import { db } from "@/lib/db";

const formHandlers = async ({ getQuantity }: { getQuantity: number }) => {
  try {
    const enginePrice = await db.engine.findUnique({
      where: { engineName: 'TestName' },
      select: { price: true }
    });

    const engineTotalPrice = enginePrice ? enginePrice.price * getQuantity : 0;
    console.log(`Total Engine Price: ${engineTotalPrice}`);
  } catch (error) {
    console.error('Error fetching engine price:', error);
  }
};

export default formHandlers;
