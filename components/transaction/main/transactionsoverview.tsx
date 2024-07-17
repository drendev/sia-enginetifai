"use client";

import type { StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { Statistic } from 'antd';
import {useEffect, useState} from 'react';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
  );

interface Transactions {
    totalTransactions: number;
    transactionsWithDelivery: number;
    pendingTransactions: number;
}

export function TransactionsOverview() {
    const [transactions, setTransactions] = useState({} as Transactions);

    useEffect(() => {
        const fetchSalesData = async () => {
            const res = await fetch('/api/transactions/transactionsoverview', {
                method: 'POST'
            });
            const data = await res.json();
            setTransactions(data);
        };
    
        fetchSalesData();
      }, []);

    return (
        <>
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>Transactions Overview</h1>
            <div className="flex justify-evenly font-sans font-semibold">
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={transactions.totalTransactions} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Transactions Made</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={transactions.transactionsWithDelivery} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Deliveries</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={transactions.pendingTransactions} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Pendings</div>
                </div>
            </div>
        </>
    )
}
