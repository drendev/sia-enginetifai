"use client";

import { Badge, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import 'moment/locale/en-gb';
import Link from 'next/link';

interface RecentTransaction {
    engineId: number;
    engineName: string[];
    createAt: string;
    transactionUser: string;
    delivery: boolean;
    user: string;
}

export function RecentEngineTransaction() {
    const [transaction, setTransaction] = useState<RecentTransaction[]>([]);
    
    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch('/api/engines/transacted', {
                method: 'POST'
            });
            const data = await res.json();
            setTransaction(data);
        };

        fetchEngineData();
    }, []);

    const timeZone = 'Asia/Manila';

    const formatTransactionTime = (dateTime: string) => {
        const now = moment();
        const transactionTime = moment(dateTime);
        const diffMinutes = now.diff(transactionTime, 'minutes');
        const diffHours = now.diff(transactionTime, 'hours');
        const diffDays = now.diff(transactionTime, 'days');

        if (diffMinutes < 1) {
            return 'just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <>
            <div className="text-2xl font-bold font-sans mb-7 my-5">
                <span className="bg-fireworks bg-no-repeat bg-right-bottom bg-contain pb-4 text-red-900"> Recently Transacted </span>
            </div>
            <div className="text-md">
                <div className="w-full">
                    <div className="bg-red-primary/15 flex font-bold">
                        <div className="text-left p-4 flex-1">Engine</div>
                        <div className="text-left p-4 flex-1">Type</div>
                        <div className="text-left p-4 flex-1">Time</div>
                        <div className="text-left p-4 flex-1">Staff</div>
                    </div>
                    <div className="divide-y">
                        {transaction.map((item) => (
                            <Link key={item.engineId} href={'test'}>
                            <div key={item.engineId} className="flex hover:bg-red-primary/5">
                                
                                <div className="p-4 flex-1">{item.engineName.join(', ')}</div>
                                <div className="p-4 flex-1">
                                    <Badge status={item.delivery ? "success" : "processing"} text={item.delivery ? "Delivery" : "Store"} className='text-xs'/>
                                </div>
                                <div className="p-4 flex-1">{formatTransactionTime(item.createAt)}</div>
                                <div className="p-4 flex-1">
                                    <Avatar.Group>
                                        <Avatar src={`${item.user}`} style={{ backgroundColor: '#fde3cf' }}>A</Avatar>
                                    </Avatar.Group>
                                </div>
                                
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
