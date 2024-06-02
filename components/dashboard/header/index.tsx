
import { NavAdmin } from "./navbar/admin/admin-nav";
import { NavLogo } from "./navbar/nav-logo";
import Dropdown from './navbar/userheader/dropdown';

export default async function DashboardHeader () {

    return (
      <>
        <header className="top-0 flex fixed justify-between w-full shadow-md bg-white z-[0] dark:bg-slate-900">
          <NavLogo /> 
        <div className="justify-evenly pt-1 hidden md:flex md:relative">           
          <NavAdmin />
        </div>
          <Dropdown />
        </header>
        <footer className="flex bottom-0 fixed md:hidden justify-evenly w-full pb-1 bg-white shadow-top-md dark:bg-slate-900">
          <NavAdmin />
        </footer>
      </>
    )
}