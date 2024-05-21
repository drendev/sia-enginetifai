import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserHeader from "./navbar/userheader/userheader";
import { NavAdmin } from "./navbar/admin/admin-nav";
import { NavLogo } from "./navbar/nav-logo";
import Dropdown from './navbar/userheader/dropdown';


export default async function DashboardHeader () {
    const session = await getServerSession(authOptions);
    const role = session?.user.role;

    return (
      <>
        <header className="top-0 flex fixed justify-between w-full shadow-md bg-white z-[1]">
          <NavLogo /> 
        <div className="justify-evenly pt-1 hidden md:flex md:relative">           
          <NavAdmin />
        </div>
          <Dropdown />
        </header>
        <footer className="flex bottom-0 fixed md:hidden justify-evenly w-full mb-1 bg-white shadow-top-md">
          <NavAdmin />
        </footer>
      </>
    )
}