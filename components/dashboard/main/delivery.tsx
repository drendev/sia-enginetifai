'use client'

import { Button } from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';


export default function DeliveryDashboard() {

    const router = useRouter();
    return (
        <>
    <h2>Delivery Dashboard</h2>
    	<Button
		className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
		onClick={(e) => {
			e.preventDefault();
			signOut();
			router.push("/");
		}}
		>
						Sign out
					</Button>
    </>
)
}