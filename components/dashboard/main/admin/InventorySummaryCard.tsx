import React from "react";
import { InventorySummaryItem} from "./salesoverview"; 

interface InventorySummaryCardProps {
    item: InventorySummaryItem;
  }

export function InventorySummaryCard ({ item }: InventorySummaryCardProps){
    return(
        <div 
        className="mb-4 shadow rounded-lg border border-slate-200 hover:border-red-400 bg-white py-2 px-4
     cursor-pointer flex items-center gap-3 justify-between transition-all duration-300">

     <h2 className="uppercase text-slate-500 text-sm">{item.title}</h2>
     <h4 className=" text-2xl text-black">{item.number}</h4>
   
   </div>
    )
}