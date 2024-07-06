"use client";

import { Badge, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone'; // Import moment-timezone
import 'moment/locale/en-gb'; // Import English locale for moment
import Link from 'next/link';

interface RecentTransaction {
    engineId: number;
    engineName: string[];
    createAt: string; // Assuming createAt is a date/time string
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

    // Set the timezone to Philippines (Asia/Manila)
    const timeZone = 'Asia/Manila';

    // Function to format the time according to Philippines timezone
    const formatTransactionTime = (dateTime: string) => {
        const now = moment(); // Current time
        const transactionTime = moment(dateTime); // Transaction time
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
                <table className="w-full">
                    <thead className="bg-red-primary/15">
                         <tr>
                            <th className="text-left p-4">Engine</th>
                            <th className="text-left p-4">Type</th>
                            <th className="text-left p-4">Time</th>
                            <th className="text-left p-4">Staff</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {transaction.map((item) => (
                            <tr key={item.engineId}>
                                <td className="p-4">{item.engineName.join(', ')}</td>
                                <td className="p-4"><Badge status={item.delivery ? "success" : "processing"} text={item.delivery ? "Delivery" : "Store"} className='text-xs'/></td>
                                <td className="p-4">{formatTransactionTime(item.createAt)}</td>
                                <td className="p-4">
                                    <Avatar.Group>
                                        <Avatar src={`${item.user}`} style={{ backgroundColor: '#fde3cf' }}>A</Avatar>
                                    </Avatar.Group>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
