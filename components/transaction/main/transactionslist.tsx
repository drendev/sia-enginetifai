"use client";

import { Avatar, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Link from 'next/link';

interface Transaction {
    id: number;
    engineName: string;
    totalPrice: number;
    paymentMethod: string;
    deliveryDate: string;
    createAt: string;
    picture: string[]; // Ensure picture is an array of strings
}

export function TransactionsList() {
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState([] as Transaction[]);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 5; // Number of transactions per page

    useEffect(() => {
        const fetchTransactionData = async () => {
            const res = await fetch('/api/transactions/transactionslist', {
                method: 'POST'
            });
            const data = await res.json();
            // Sort transactions from newest to oldest
            const sortedData = data.sort((a: Transaction, b: Transaction) => 
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
            );
            setTransactions(sortedData);

            // Reset pagination to page 1 when data changes due to search
            setCurrentPage(1);
        };

        fetchTransactionData();
    }, [search]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.id.toString().includes(search)
    );

    const currentTransactions = filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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

    const formatCurrency = (amount: number) => {
        const formatter = new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formatter.format(amount);
    };

    const formatDate = (date: string) => {
        return moment(date).format('MMMM D, YYYY');
    };

    return (
        <>
            <Input
                className="bg-white shadow-inner font-sans font-semibold rounded-full"
                size="large"
                placeholder="Search Transaction by ID"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="w-full mt-4">
                <div className="bg-red-primary/15 font-sans flex font-bold">
                    <div className="text-left p-2 flex-1">Transaction ID</div>
                    <div className="text-left p-2 flex-1">Engine/s</div>
                    <div className="text-left p-2 flex-1">Sales</div>
                    <div className="text-left p-2 flex-1">Payment Method</div>
                    <div className="text-left p-2 flex-1">Date</div>
                    <div className="text-left p-2 flex-1">Time</div>
                </div>
                <div className="divide-y">
                    {currentTransactions.length === 0 ? (
                        <div className="text-center p-4">No transactions</div>
                    ) : (
                        currentTransactions.map((item) => (
                            <Link href={`/transactions/view/${item.id}`} key={item.id} className="flex hover:bg-red-primary/5 font-sans text-slate-800 dark:text-slate-200">
                                <div className="p-2 flex-1">{item.id}</div>
                                <div className="p-2 flex-1">
                                    <Avatar.Group 
                                        shape='square'
                                        max={{
                                        count: 2,
                                        style: { color: 'red-primary/10', backgroundColor: '#BB4747', cursor: 'pointer' },
                                        popover: { trigger: 'hover' },
                                    }}>
                                        {item.picture.map((pic, index) => (
                                            pic ? <Avatar key={index} src={pic} /> : <Avatar key={index}>A</Avatar>
                                        ))}
                                    </Avatar.Group>
                                </div>
                                <div className="p-2 flex-1">{formatCurrency(item.totalPrice)}</div>
                                <div className="p-2 flex-1">{item.paymentMethod}</div>
                                <div className="p-2 flex-1">{formatDate(item.deliveryDate)}</div>
                                <div className="p-2 flex-1">{formatTransactionTime(item.createAt)}</div>
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
