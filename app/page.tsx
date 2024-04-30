import Index from "./(main)/@index/page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Dashboard from "./(dashboard)/layout";

export default async function Home() {
    const session = await getServerSession(authOptions);
    
    return (
        <>
        {session ? <Dashboard /> : <Index />}
        </>
    )
}