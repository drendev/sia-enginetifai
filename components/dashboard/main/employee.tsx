"use client";

import { useEffect, useState } from "react";
import { SalesOverview } from "./admin/salesoverview";
import ThirdGrid from "./admin/thirdgrid";
import { SecondGrid } from "./admin/secondgrid";


type User = {
    map(arg0: (user: any, index: any) => any): import("react").ReactNode;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
}

export default function EmployeeDashboard() {
    // const [user, setUser] = useState<User | null>(null);

    // const getUser = async () => {
    //     const res = await fetch('/api/testapi', {
    //         method: 'GET'
    //     });
    //     const data = await res.json(); 
    //     setUser(data);
    // }

    // useEffect(() => {
    //     getUser();
    // }, [])

    // return(
    //     <div className="mt-16">
    //         {user && user.map((user, index) => (
    //             <div key={index} className="mb-10">
    //                 <p className="text-lg font-bold">Username: {user.username}</p>
    //                 <p className="text-lg font-bold">Email: {user.email}</p>
    //                 <p className="text-lg font-bold">Password: {user.password}</p>
    //                 <p className="text-lg font-bold">Role: {user.role}</p>
    //             </div>
    //         ))}
    //     </div>
    // )

    return (
        <>
            <SalesOverview/>
            <SecondGrid />
            <ThirdGrid />
        </>
    )

}