import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from './@admin/page';
import EmployeeDashboard from './@employee/page';
import DeliveryDashboard from './@delivery/page';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const role = session?.user.role;
    
    return (
         <>
         {role === 'admin' ? <AdminDashboard /> : role === 'employee' ? <EmployeeDashboard /> : <DeliveryDashboard />}
         <h2> Test </h2>
         </>
        )
}