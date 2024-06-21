
import Item from "antd/es/list/Item";
import Link from "next/link";
import React from "react";
import { SalesActivityCard } from "./SalesActivityCard";
import { InventorySummaryCard } from "./InventorySummaryCard";
import { useEffect, useState } from "react";

export interface SalesActivityItem{
  href:string;
  number: number;
  unit: string;
  title: string;
  color: string;
}

export interface InventorySummaryItem{
  title: string;
  number: number;
}

export function SalesOverview() {
   
  const salesActivity = [
        {
            title:"To be Packed",
            number:10,
            unit: "Qty",
            href:"#",
            color: "text-red-600",
        },
        {
            title:"Transacted Engines",
            number:0,
            unit: "Qty",
            href:"#",
            color: "text-red-600",
        },
        {
            title:"Delivered Engines",
            number:5,
            unit: "Pkgs",
            href:"#",
            color: "text-red-600",
        },
        {
            title:"To be Invoiced",
            number:10,
            unit: "Qty",
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


  return (
    <div className="bg-red-100 border-b border-slate-350  grid grid-cols-12 gap-4">      
      {/* Sales Activity */}
      <div className="col-span-8 border-r border-slate-300 p-8">
        <h2 className="mb-6 text-xl">Sales Activity</h2>
        <div className="pr-7 grid grid-cols-4 gap-2">
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
