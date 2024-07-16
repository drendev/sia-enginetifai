"use client";

import type { StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { Statistic } from 'antd';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
  );

export function TransactionsOverview() {
    return (
        <>
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>Transactions Overview</h1>
            <div className="flex justify-evenly font-sans font-semibold">
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={112} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Transactions Made</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={112} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Deliveries</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="rounded-full h-24 w-24 flex justify-center items-center border-solid border-red-primary border-4">
                        <span className="text-2xl text-red-primary"><Statistic value={112} formatter={formatter} /></span>
                    </div>
                    <div className="text-md mt-2">Pendings</div>
                </div>
            </div>
        </>
    )
}
