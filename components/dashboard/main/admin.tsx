'use client'

import { Button, Skeleton, Space } from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

const AdminDashboard: React.FC = () => {
	const [loading, setLoading] = useState(true);
  const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
		  setLoading(false); 
		}, 2000);

		return () => clearTimeout(timer);
	  }, []); 
    return (
        <>
		<Space direction="vertical" style={{ width: '100%' }} size={20}>
      <Skeleton loading={loading} active>
        <h4 style={{ marginBottom: 16 }}>Masipag na member</h4>
        <p>
          Deserve ng ice coffee sa MCDO :D 
        </p>
      </Skeleton>
    </Space>
    <h2>Admin Dashboard</h2>
    <Button
		className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
		onClick={(e) => {
			e.preventDefault();
			signOut();
		}}
		>
						Sign out
					</Button>
    </>
)
}

export default AdminDashboard;