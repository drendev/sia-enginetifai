import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserHeader from "./navbar/userheader";
import { NavAdmin } from "./navbar/admin/admin-nav";
import { NavLogo } from "./navbar/nav-logo";


export default async function DashboardHeader ({ children }: any) {
    const session = await getServerSession(authOptions);
    const role = session?.user.role;

    return (
      <>
        <header className="stick-0 top-0 flex justify-between w-full shadow-md md:h-14 h-12">
          <NavLogo />
        <div className="justify-evenly pt-1 hidden md:flex md:sticky">           
          <NavAdmin />
        </div>
          <UserHeader />
        </header>
        {children}
        <footer className="flex bottom-0 fixed md:hidden justify-evenly w-full mb-1 shadow-top-md">
          <NavAdmin />
        </footer>
      </>
    )
}