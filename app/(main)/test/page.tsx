
import { db } from "@/lib/db";

export default async function AddEngine() {
        const enginePrice = await db.engine.findUnique({
      where: {engineName: 'TestName'},
      select: {price: true}
    });

    const engineTotalPrice = enginePrice ? enginePrice.price * 10 : 0;
    return(
        <>
        <h2>{engineTotalPrice}</h2>
        </>
    )
}