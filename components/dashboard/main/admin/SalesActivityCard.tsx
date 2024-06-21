import Link from "next/link";
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import React from "react";
import { SalesActivityItem } from "./salesoverview"; 

interface SalesActivityCardProps {
    item: SalesActivityItem;
  }

export function SalesActivityCard({ item }: SalesActivityCardProps){
    return(
        <Link href={item.href} className="shadow rounded-lg border border-slate-200 hover:border-red-400 bg-white px-3 py-5
                    cursor-pointer flex items-center flex-col gap-2 transition-all duration-300">
                     <h4 className={'font-semibold text-3xl ${item.color}'}>{item.number}</h4>
                     <small className="text-slate-500">{item.unit}</small>
                     <div className="flex items-center space-x-2 text-slate-500">
                       <CheckCircleOutlined className="w-4 h-4" />
                       <span className="uppercase text-xs">{item.title}</span>
                     </div>
                   </Link>
    )
}