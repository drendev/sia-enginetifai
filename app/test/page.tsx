import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
    const session = await getServerSession(authOptions);
    const picture = session?.user?.picture;
    return (
        <>
        <img src={`${picture}`} alt="Next.js logo" />
        </>
    )
}