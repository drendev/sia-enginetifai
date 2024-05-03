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
        <h4 style={{ marginBottom: 16 }}>Skeleton Loading Testing </h4>
        <p>
          Data Loading Testing
        </p>
      </Skeleton>
    </Space>
    <h2>Admin Dashboard</h2>
    </>
)
}

export default AdminDashboard;