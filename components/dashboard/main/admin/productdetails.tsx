"use client";

import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { EngineStorage } from "./enginestorage";
import { EngineTypesChart } from "./enginetypes";

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
        <Link key={engine.engineId} href={`/engines/${engine.engineId}`}>
            <div className="border border-gray-200 p-1 rounded-lg flex flex-col items-center
            hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md w-full">   
                <img src={`${engine.engineImage}`} alt="" className="w-20 h-20 md:w-20 md:h-20 mb-2"/>
                <h4 className="text-sm font-semibold">{engine.engineName}</h4>
                <p className="text-sm text-gray-400">{engine.engineSold} sold</p>
            </div>
        </Link>
    ))
    
    return(
        <>
        <h1 className="text-2xl font-bold font-sans text-red-950 mb-7 my-5">
        <span className="bg-fireworks bg-no-repeat bg-right-bottom bg-contain pb-4"> Product Details </span> 
        </h1>
        <div className="flex flex-col md:grid md:grid-cols-5 gap-5 md:my-5">
            <div className="col-span-1 md:col-span-3 space-y-2 md:space-y-5">
                <div className="bg-white shadow-md md:h-52 rounded-xl p-4 space-y-3">
                    <h3 className="text-red-900 font-bold text-lg font-sans"> Top Selling Engines </h3>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                            {engineDetails}
                        </div>
                </div>
                <div className="bg-white flex shadow-md h-auto md:h-44 w-full rounded-xl p-4 space-y-2">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-4 w-full">
                        <div className="w-full md:w-1/2">
                            <h3 className="text-red-900 font-bold text-lg font-sans">Engine Types</h3>
                            <h3 className="font-semibold font-sans text-sm md:text-md mt-4 md:mt-8">Explore top engine types interactively</h3>
                            <p className="font-sans font-light"><span className="text-2xl md:text-3xl font-semibold text-[#BB4747]">16</span> total engine types</p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center">
                            <div className="max-w-full">
                                <EngineTypesChart />
                            </div>
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