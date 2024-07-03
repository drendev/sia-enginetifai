"use client";

import EmployeeDashboard from "@/components/dashboard/main/employee";
import { StaffDisplay } from "@/components/staff/StaffDisplay";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import Link from "next/link";



export default function Employees() {

  const [usersTotal, setUsersTotal] = useState<number | null>(null);
  

  const getUsers = async () => {
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
      });
      const data = await res.json();
      const specificUsers: number = data.usersTotal;
      setUsersTotal(specificUsers);
      console.log(specificUsers)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="pt-20 pl-10 pr-10">
        <form className="mb-10">
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Employees"
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex">
          <div className="mt-3 flex-grow">{usersTotal} {usersTotal === 1 ? 'Staff' : 'Staffs'}</div>
          <button className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
            <svg
              className="w-3.5 h-3.5 me-2"
              width="72"
              height="48"
              viewBox="0 0 72 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 48H44V40H28V48ZM0 0V8H72V0H0ZM12 28H60V20H12V28Z"
                fill="white"
              />
            </svg>
            Filter
          </button>
          <Link href="./create-user" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
            <svg
              className="w-3.5 h-3.5 me-2"
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56 32H32V56H24V32H0V24H24V0H32V24H56V32Z"
                fill="white"
              />
            </svg>
            Add Employee
          </Link>
        </div>
        
        <div className="grid grid-cols-1 justify-center gap-x-8 gap-y-4 mt- 5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <StaffDisplay />
        </div>
      </div>
    </>
  );
}
