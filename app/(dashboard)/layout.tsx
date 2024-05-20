import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from '../../components/dashboard/main/admin';
import EmployeeDashboard from '../../components/dashboard/main/employee';
import DeliveryDashboard from '../../components/dashboard/main/delivery';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/header';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const role = session?.user.role;
    
    return (
         <>
         <main className='w-full max-w-screen-xl min-w-full'>
         <DashboardHeader>
         <div className='m-5'>
         {role === 'admin' ? <AdminDashboard /> : role === 'employee' ? <EmployeeDashboard /> : <DeliveryDashboard />}
         <h2>For Testing Only</h2>
         <Link
         href={'/create-user'}>
            Create User
         </Link>
         </div>
         </DashboardHeader>
         </main>
         </>
        )
}