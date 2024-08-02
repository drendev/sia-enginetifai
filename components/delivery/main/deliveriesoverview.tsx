"use client";

import type { StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { Statistic } from 'antd';
import {useEffect, useState} from 'react';

interface Deliveries {
    totalDelivery: number;
    delivered: number;
    pendingDelivery: number;
}

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
  );

export function DeliveriesOverview() {
    const [deliveryData, setDeliveryData] = useState({} as Deliveries);

    useEffect(() => {
        const fetchSalesData = async () => {
            const res = await fetch('/api/delivery/deliveriesoverview', {
                method: 'POST'
            });
            const data = await res.json();
            setDeliveryData(data);
        };

        fetchSalesData();
    }, []);
    return(
        <>
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>Deliveries Overview</h1>
            <div className="flex justify-evenly font-sans font-semibold">
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={deliveryData.totalDelivery} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Overall Deliveries</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={deliveryData.delivered} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Delivered</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={deliveryData.pendingDelivery} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Pending Deliveries</div>
                </div>
            </div>
        </>
    )
}