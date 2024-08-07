import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from '../../../components/dashboard/main/admin/admin';
import EmployeeDashboard from '../../../components/dashboard/main/employee';
import DeliveryDashboard from '../../../components/dashboard/main/delivery';
import CourierDashboard from '@/components/dashboard/main/courier/courier';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const role = session?.user.role;
    
    return (
         <>
         <div className='pt-10 pb-10 md:pb-0 md:pt-16'>
         {role === 'admin' ? <AdminDashboard /> : role === 'employee' ? <EmployeeDashboard /> : <CourierDashboard/> }
         </div>
         </>
        )
}