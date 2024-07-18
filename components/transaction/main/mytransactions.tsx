"use client";

import { useState, useEffect } from "react";
import { Select, Pagination, Badge, Skeleton } from 'antd';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import moment from 'moment-timezone';

interface MyTransactions {
    id: string;
    delivery: boolean;
    totalPrice: string;
    createAt: string;
    deliveryStatus: string;
    deliveryDate: string;
}

export function MyTransactions() {
    const { data: session } = useSession();
    const { Option } = Select;
    const [status, setStatus] = useState("all");
    const [transactions, setTransactions] = useState([] as MyTransactions[]);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 3; // Number of transactions per page

    const currentUser = session?.user?.username;
    useEffect(() => {
        if (!currentUser) return; // Avoid fetching data if user is null

        const fetchSalesData = async () => {
            const res = await fetch('/api/transactions/mytransactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: currentUser
                }),
            });
            const data = await res.json();
            // Sort transactions from newest to oldest
            const sortedData = data.sort((a: MyTransactions, b: MyTransactions) => 
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
            );
            setTransactions(sortedData);
        };

        fetchSalesData();
    }, [currentUser]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredTransactions = transactions.map((item) => {
        const now = moment();
        const deliveryDate = moment(item.deliveryDate);

        if (deliveryDate.isAfter(now, 'day') || item.deliveryStatus === 'pending') {
            item.deliveryStatus = 'pending';
        } else if (deliveryDate.isSame(now, 'day') || item.deliveryStatus === 'active') {
            item.deliveryStatus = 'active';
        }

        return item;
    }).filter((item) => {
        if (status === 'done') {
            return item.deliveryStatus === 'done' || !item.delivery;
        } else if (status === 'active') {
            return item.deliveryStatus === 'active' && item.delivery;
        } else if (status === 'pending') {
            return item.deliveryStatus === 'pending';
        } else if (status === 'all') {
            return true;
        }
        return true;
    });
 
    const currentTransactions = filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    console.log(transactions);

    if (!currentUser) {
        return <div className="p-4"><Skeleton active /></div>;
    }

    // Format user's transaction time
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

    const formatCurrency = (amount: string) => {
        const formatter = new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formatter.format(parseFloat(amount));
    };

    return (
        <>
            <div className="flex justify-between pt-3">
                <h1 className='text-red-900 font-sans font-bold text-xl pb-2'> My Transactions </h1>
                <Select
                    defaultValue="all"
                    style={{ width: 120, marginBottom: 20 }}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="all">All</Option>
                    <Option value="active">Active</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="done">Done</Option>
                </Select>
            </div>

            <div className="w-full">
                <div className="bg-red-primary/15 font-sans flex font-bold">
                    <div className="text-left p-2 flex-1">Type</div>
                    <div className="text-left p-2 flex-1">Sales</div>
                    <div className="text-left p-2 flex-1">Time</div>
                </div>
                <div className="divide-y">
                    {currentTransactions.length === 0 ? (
                        <div className="text-center p-4">No transactions</div>
                    ) : (
                        currentTransactions.map((item) => (
                            <Link key={item.id} href={`/transactions/view/${item.id}`}>
                                <div key={item.id} className="flex hover:bg-red-primary/5 font-sans text-slate-800 dark:text-slate-200">
                                    <div className="p-2 flex-1">
                                        <Badge status={item.delivery ? "success" : "processing"} text={item.delivery ? "Delivery" : "Store"} className='text-xs' />
                                    </div>
                                    <div className="p-2 flex-1">{formatCurrency(item.totalPrice)}</div>
                                    <div className="p-2 flex-1">
                                        {formatTransactionTime(item.createAt)}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                {filteredTransactions.length > 0 && (
                    <div className="text-center pt-3">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredTransactions.length}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
