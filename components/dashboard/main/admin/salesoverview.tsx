"use client";

import React from "react";
import { SalesActivityCard } from "./SalesActivityCard";
import { InventorySummaryCard } from "./InventorySummaryCard";
import { useEffect, useState } from "react";

export interface SalesActivityItem{
  href:string;
  number: any;
  title: string;
  color: string;
}

export interface InventorySummaryItem{
  title: string;
  number: number;
}

interface TodaysTransaction {  
  today: number,
  profit: number,
  averageWeeklyTransactions: number
}

export function SalesOverview() {
  const [transaction, setTransaction] = useState<TodaysTransaction>();
  useEffect(() => {
    const fetchEngineData = async () => {
        
    const res = await fetch('/api/datavisualization/todaysdata',{
        method: 'GET',
        next: {
          revalidate: 2
        }
    })
    const data = await res.json()
    setTransaction(data)
    }

    fetchEngineData() 
}, [])

function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US'); // Formats the number with commas
}

  const salesActivity = [
        {
            title:"Transactions",
            number: transaction?.today,
            href:"#",
            color: "text-red-600",
        },
        {
            title:"Total Sales",
            number: transaction?.profit,
            href:"#",
            color: "text-red-600",
        },
        {
            title:"Average Order Value",
            number: transaction?.averageWeeklyTransactions,
            href:"#",
            color: "text-red-600",
        },
    ];

    const inventorySummary=[
      {
        title: "Quantity in Hand",
        number: 5,
      },
      {
        title: "Quantity To Be Received",
        number: 0,
      }
    ]
    console.log(transaction)

  return (
    <div className="bg-red-primary/20 border-b border-slate-350 grid grid-cols-11 gap-4">      
      {/* Sales Activity */}
      <div className="col-span-6 border-r border-slate-300 p-8">
        <h2 className="mb-6 text-xl">Todays Activity</h2>
        <div className="grid grid-cols-3 gap-2">
          {/* Cards */}
            {salesActivity.map((item,i)=>{
                return(
                  <SalesActivityCard item={item} key={i}/>  
                );
            })
          }
          
        </div>
      </div>
      {/*Inventory Summary */}
      <div className="col-span-4 p-8">
      <h2 className="mb-6 text-xl">Inventory Summary</h2>
      <div className="">
        {
          inventorySummary.map((item,i)=>{
            return(
             <InventorySummaryCard item={item} key={i}/>
            )
          })}
      </div>
      </div>
    </div>
  );
}
