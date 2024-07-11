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

interface EngineStock {
    engineLowStockCount: number,
    enginesTotal: number
}

export function EngineStorage() {
    // State to store the data
    const [engineStock, setEngineStock] = useState<EngineStock>();

    // Fetch the data from the api
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

    const engineStockCount = engineStock?.engineLowStockCount;
    const enginesTotal = engineStock?.enginesTotal;
    // Doughnut chart data
    const data: ChartData = {
        labels: ['Low Stock Engines', 'All Engines'],
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
                    size: 10,
                    weight: 'bold' as const 
                } as DatalabelsFont 
            }
        }
    };

    return(
        <>             
            <div className="border-b border-gray-200 dark:border-slate-700 flex items-center justify-center mb-3">
                <h4 className="text-md font-bold font-sans text-lg pb-3 text-red-900"> Engine Storage </h4>
            </div>
            <div className="p-1 flex flex-col items-center justify-center space-y-2">
                <div className="w-52 h-52">
                    <Doughnut data={data} options={options} />
                </div>
                <h3 className="text-sm font-light font-sans text-md"> Low Stock Engines: {engineStockCount} </h3>
                <h3 className="text-sm font-light font-sans text-md"> All Engines: {enginesTotal} </h3>
            </div>
        </>
    )
}