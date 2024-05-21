import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
    children: React.ReactNode;
}   

const Dashboard = async ({ children }: Props) => {
    const session = await getServerSession(authOptions);
    if(!session) redirect('/')
    return(
        <>
            {children}
        </>
    )
}

export default Dashboard;