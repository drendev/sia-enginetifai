
import { Button } from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';


export default function EmployeeDashboard() {

    const router = useRouter();
    return (
        <>
    		<h2>Employee Dashboard</h2>
    	</>
)
}