import { NavAdmin } from "./navbar/admin/admin-nav";
import { NavLogo } from "./navbar/nav-logo";
import Dropdown from './navbar/userheader/dropdown';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function DashboardHeader () {
  const session = await getServerSession(authOptions);
  const isAdminOrEmployee = session?.user?.role === "admin" || session?.user?.role === "employee";

  return (
    <>
      <header className="top-0 flex fixed justify-between w-full shadow-md bg-white z-[1000] dark:bg-slate-900">
        <NavLogo /> 
        <div className="justify-evenly pt-1 hidden md:flex md:relative">    
          {isAdminOrEmployee ? <NavAdmin /> : null}
        </div>
        <Dropdown />
      </header>
      <div className="flex bottom-0 z-[1000] max-w-screen-xl fixed md:hidden justify-evenly w-full pb-1 bg-white shadow-top-md dark:bg-slate-900">
        {isAdminOrEmployee ? <NavAdmin /> : null}
      </div>
    </>
  )
}
