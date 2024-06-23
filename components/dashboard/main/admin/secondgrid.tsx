"use client"
import React from "react";
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from "react";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    ChartDataLabels
);

interface ChartData {
    labels: string[];
    datasets: {
    data: any[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    }[];
}

interface DatalabelsFont {
    size: number;
    weight: 'bold' | 'normal' | 'bolder' | 'lighter' | number;
}
interface EngineTopSelling {  
    quantity: number[],
    picture: string[],
    engineName: string[],
    totalTransactionQuantity: number,
  }
interface EngineStock {
    engineLowStockCount: number,
    enginesTotal: number
}
export function SecondGrid() {
    // Top Selling Items Api
    const [dataEngine, setData] = useState<EngineTopSelling[]>([]);

    const [engineStock, setEngineStock] = useState<EngineStock>();

    useEffect(() => {
        const fetchEngineData = async () => {
            
        const res = await fetch('/api/datavisualization/todaysdata',{
            method: 'POST'
        })
        const data = await res.json()
        setEngineStock(data)
        }

        fetchEngineData() 
    }, [])

    useEffect(() => {
        const fetchEngineData = async () => {
            
        const res = await fetch('/api/datavisualization/topselling',{
            method: 'POST'
        })
        const data = (await res.json()) as EngineTopSelling[];
        setData(data)
        }
    
        fetchEngineData() 
    }, [])
    const sortedData = [...dataEngine].sort((a, b) => b.totalTransactionQuantity - a.totalTransactionQuantity);

    const engineDetails = sortedData.map((engine, index) => (
        <div key={index} className="border border-slate-300 p-4 flex flex-col items-center justify-center">
            <img src={`${engine && engine.picture}`} className="w-full h-auto mb-2" />
            <h3 className="text-xl font-semibold mt-7">{engine.engineName}</h3>
            <p className="text-slate-500 text-lg font-semibold">{engine.totalTransactionQuantity} sold</p>
        </div>
      ));
      
    const engineStockCount = engineStock?.engineLowStockCount;
    const enginesTotal = engineStock?.enginesTotal;
    // Doughnut chart data
    const data: ChartData = {
        labels: ['Low Stock Items', 'All Items'],
        datasets: [
            {
                data: [engineStockCount || 0, enginesTotal || 0], 
                backgroundColor: ['#B2ADAD', '#D05050'],
                hoverBackgroundColor: ['#B2ADAD', '#D05050']
            }
        ]
    };
    // Doughnut chart 
    const options = {
        plugins: {
            datalabels: {
                display: true,
                formatter: (value: number, context: any) => {
                    let sum = 0;
                    const dataArr = context.chart.data.datasets[0].data;
                    dataArr.forEach((data: number) => {
                        sum += data;
                    });
                    const percentage = ((value * 100) / sum).toFixed(2) + "%";
                    return percentage;
                },
                color: '#fff',
                font: {
                    size: 18,
                    weight: 'bold' as const 
                } as DatalabelsFont 
            }
        }
    };

    return (
        <div className="bg-white-100 border-b border-slate-350 grid grid-cols-12 gap-3 p-4">
            <div className="col-span-12">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Card 1: Product Details */}
                    <div className="shadow-lg col-span-12 md:col-span-6 rounded-lg border border-slate-200 bg-white py-6 px-4 cursor-pointer flex flex-col gap-4 justify-between min-w-0">
                        <h2 className="uppercase text-black text-base font-semibold">Product Details</h2>
                        <hr className="shadow-md border-slate-300 my-2 mx-4" />
                        <div className="flex justify-between items-center mt-2 mb-4"> 
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xl text-black">Low Stock Engines Count:</h4>
                                    <p className="text-slate-500 text-xl font-semibold">{engineStockCount}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xl text-black">All Engines:</h4>
                                    <p className="text-slate-500 text-xl font-semibold">{enginesTotal}</p>
                                </div>
                            </div>
                            <div className="w-2/5">
                                <Doughnut data={data} options={options} />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Top Selling Items */}
                    <div className="shadow-lg col-span-12 md:col-span-6 rounded-lg border border-slate-200 bg-white py-6 px-4 cursor-pointer flex flex-col gap-4 justify-between min-w-0">
                        <h2 className="uppercase text-black text-base font-semibold">Top Selling Engines</h2>
                        <hr className="shadow-md border-slate-300 my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {engineDetails}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
