"use client";

import { useSession } from "next-auth/react";
import moment from 'moment-timezone';

export function InventorySummary() {
    const { data: session } = useSession();
    const utcDate = new Date();
    const timeZone = 'Asia/Manila';

    const dateToday = moment.tz(utcDate, timeZone).format('MMMM D, YYYY');

    return(
        <div className="flip-card flex flex-col space-y-5 md:pt-5">
            <div className="flip-card-inner flex flex-col w-full h-52 rounded-2xl shadow-xl cursor-pointer">
                <div className="flip-card-front bg-bgcard bg-bottom bg-cover bg-no-repeat p-7">
                    <h3 className="text-red-50 text-3xl font-sans font-extrabold">Inventory Summary</h3>
                    <h3 className="text-red-100 text-2xl font-sans font-extrabold pt-16">
                        Hello, {session?.user?.username}
                    </h3>
                    <h3 className="text-red-100 text-lg">{dateToday}</h3>
                </div>
                <div className="flip-card-back p-7 rounded-2xl">
                    <h3 className="text-white text-3xl font-sans font-extrabold">Inventory status</h3>
                </div>
            </div>
        </div>
    )
}
