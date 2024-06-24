"use client";

import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { EngineStorage } from "./enginestorage";

interface TopSellingDetails {
    engineId: number,
    engineName: number,
    engineSold: number,
    engineImage: string
}

export function ProductDetails() {
    // State to store the data
    const [engine, setEngine] = useState<TopSellingDetails[]>([]);

    // fetch the data from the api
    useEffect(() => {
        const fetchEngineData = async () => {
            
        const res = await fetch('/api/datavisualization/topselling',{
            method: 'POST'
        })
        const data = (await res.json()) as TopSellingDetails[];
        setEngine(data)
        }
    
        fetchEngineData() 
    }, [])

    // Sort the data by the engine sold
    const sortedData = [...engine].sort((a, b) => b.engineSold - a.engineSold);
    
    // Display the data
    const engineDetails = sortedData.map((engine) => (
        <Link key={engine.engineId} href={`/product/${engine.engineId}`}>
            <div className="border border-gray-200 p-1 rounded-lg flex flex-col items-center justify-center 
            hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md">
                <img src={`${engine.engineImage}`} alt="" className=" w-20 h-20 mb-2"/>
                <h4 className="text-md font-semibold">{engine.engineName}</h4>
                <p className="text-sm text-gray-400">{engine.engineSold} sold</p>
            </div>
        </Link>
    ))
    
    return(
        <>
        <h1 className="text-2xl font-bold font-sans text-red-950 mb-7 my-5">
        <span className="bg-fireworks bg-no-repeat bg-right-bottom bg-contain pb-4"> Product Details </span> 
        </h1>
        <div className="grid grid-cols-5 gap-5 my-5 ">
            <div className="col-span-3 space-y-5">
                <div className="bg-white shadow-md h-52 w-full rounded-xl p-4 space-y-3">
                    <h3 className="text-red-900 font-bold text-lg font-sans"> Top Selling Engines </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {engineDetails}
                        </div>
                </div>
                <div className="bg-white shadow-md h-44 w-full rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                        <div className="">
                        <h3 className="text-red-900 font-bold text-lg font-sans"> Engine Types </h3>
                            <h3 className="font-semibold font-sans text-md mt-8">Explore top engine types interactively</h3>
                            <p className="font-sans font-light"><span className="text-3xl font-semibold text-[#BB4747]"> 16 </span> total engine types</p>
                        </div>
                        <div className="justify-center items-center mr-7">
                            <img src="/enginetype.png" alt="" className="h-36 w-52"/>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="h-full bg-white shadow-md col-span-2 rounded-xl p-6">              
                <EngineStorage />
            </div>
        </div>
        </>
    )
}