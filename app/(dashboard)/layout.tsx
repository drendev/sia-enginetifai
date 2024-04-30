import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from './@admin/admin';
import EmployeeDashboard from './@employee/employee';
import DeliveryDashboard from './@delivery/delivery';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const role = session?.user.role;
    
    return (
         <>
         {role === 'admin' ? <AdminDashboard /> : role === 'employee' ? <EmployeeDashboard /> : <DeliveryDashboard />}
         <h2>For Testing Only</h2>
         </>
        )
}