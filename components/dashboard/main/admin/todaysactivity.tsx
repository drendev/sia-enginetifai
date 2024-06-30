"use client"

import React from "react";
import { useEffect, useState } from "react"
import { TodayCard } from "./todaycard";

export interface TodaysActivityItem{
    href:   string;
    number: any;
    title:  string;
    background: string;
}

interface TodaysActivity {
    today: number,
    profit: number,
    averageWeeklyTransactions: number
}


export function TodayActivity() {
    // State to store the data
    const [transaction, setTransaction] = useState<TodaysActivity>();

    // Fetching data from the server
    useEffect(() => {
        const fetchEngineData = async () => {
            
        const res = await fetch('/api/datavisualization/todaysdata',{
            method: 'POST',
            next: {
            revalidate: 2
            }
        })
        const data = await res.json()
        setTransaction(data)
        }

        fetchEngineData() 
    }, [])

    // Data to be displayed
    const todaysActivity = [
        {
            title:"Transactions",
            number: transaction?.today || 0,
            href:"#",
            background: "bg-transactions",
        },
        {
            title:"Total Sales",
            number: transaction?.profit || 0,
            href:"#",
            background: "bg-salesbg",
        },
        {
            title:"Average Order",
            number: transaction?.averageWeeklyTransactions || 0,
            href:"#",
            background: "bg-orderbg",
        },
    ];

    return (
        <>
        <h1 className="text-3xl md:text-4xl font-bold font-sans text-red-950 mb-5 mt-2 md:mt-0">
            <span className="bg-highlight bg-no-repeat bg-left-top bg-contain pt-6">Todays Activity</span> 
        </h1>
        <div className="flex md:grid grid-cols-3 gap-2 flex-col">
            {todaysActivity.map((item,i)=>{
                return(
                    <TodayCard item={item} key={i}/>  
                );
                })
            }
        </div>
        </>
    )
}