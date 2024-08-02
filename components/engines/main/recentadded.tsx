"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Skeleton } from 'antd';

interface RecentEngine {
    engineId: number;
    engineName: string;
    engineAdded: string;
    engineImage: string;
}

export function RecentEngineAdded() {
    const [engine, setEngine] = useState<RecentEngine[]>([]);
    const [loading, setLoading] = useState(true);

    const utcDate = new Date();
    const timeZone = 'Asia/Manila';

    const dateToday = moment.tz(utcDate, timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const formatTransactionTime = (dateTime: string) => {
        const now = moment.tz(dateToday, timeZone);  // Use dateToday instead of the current moment
        const transactionTime = moment.tz(dateTime, timeZone);
        const diffMinutes = now.diff(transactionTime, 'minutes');
        const diffHours = now.diff(transactionTime, 'hours');
        const diffDays = now.diff(transactionTime, 'days');

        if (diffMinutes < 1) {
            return 'just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
    };

    useEffect(() => {
        // Simulate a data fetch
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust the timeout duration as needed
    }, []);

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch('/api/engines/recenttransaction', {
                method: 'POST'
            });
            const data = (await res.json()) as RecentEngine[];
            setEngine(data);
        };

        fetchEngineData();
    }, []);

    const sortedData = [...engine].sort((a, b) => new Date(b.engineAdded).getTime() - new Date(a.engineAdded).getTime());

    return (
        <div className="w-full md:w-[29rem] 2xl:w-full h-48 bg-white dark:bg-slate-900 shadow-md rounded-xl p-4">
            
            <h3 className="text-red-900 font-bold text-lg font-sans"> Recently Added </h3>
            <Skeleton loading={loading} active>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {sortedData.map((engine) => (
                    <Link key={engine.engineId} href={`/engines/${engine.engineId}`}>
                    <div
                        key={engine.engineId}
                        className="border border-gray-200 dark:border-slate-700 p-1 rounded-lg flex flex-col items-center
                        hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md w-full"
                    >
                        <img src={engine.engineImage} alt={engine.engineName} className="w-20 h-20 md:w-20 md:h-20 mb-2 rounded-lg" />
                        <h4 className="text-sm font-semibold">
                        {engine.engineName.length > 15 ? (
                            <>
                                {engine.engineName.substring(0, 10)}...
                            </>
                        ) : (
                            engine.engineName
                        )}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {formatTransactionTime(engine.engineAdded)}
                        </p> 
                    </div>
                    </Link>
                ))}
            </div>
            </Skeleton>
        </div>
    );
}
