"use client";
import { useEffect, useState } from "react";
import { Button, Pagination } from 'antd';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import moment from 'moment-timezone';

interface MyDeliveries {
    id: number;
    deliveryDate: string;
    deliveryTime: string;
    transactionUser: string;
}

export function MyDeliveries() {
    const [deliveries, setDelivery] = useState([] as MyDeliveries[]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const { data: session } = useSession();
    const pageSize = 3; // Number of transactions per page

    const currentUser = session?.user?.username;

    const fetchSalesData = async () => {
        const res = await fetch('/api/delivery/mydelivery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: currentUser
            }),
        });
        const data = await res.json();
        // Sort transactions by delivery date, closest to today's date first
        const sortedData = data.sort((a: MyDeliveries, b: MyDeliveries) => 
            new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
        );
        setDelivery(sortedData);
    };

    useEffect(() => {
        if (currentUser) {
            fetchSalesData();
        }
    }, [currentUser]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDeliveryTime = (deliveryDate: string) => {
        const now = moment.tz('Asia/Manila');
        const deliveryMoment = moment.tz(deliveryDate, 'Asia/Manila');
        const diffDays = deliveryMoment.diff(now, 'days');

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
            return 'Today';
        } else {
            return 'Past Due';
        }
    };

    // Paginate the deliveries array
    const paginatedDeliveries = deliveries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>My Deliveries</h1>
            <div className="w-full text-sm">
                <div className="bg-red-primary/15 font-sans flex font-bold">
                    <div className="flex items-center justify-center p-2 flex-1">ID</div>
                    <div className="flex items-center justify-center p-2 flex-1">Delivery Time</div>
                    <div className="flex items-center justify-center p-2 flex-1">Delivery Date</div>
                    <div className="flex items-center justify-center p-2 flex-1"></div>
                </div>
                <div className="divide-y">
                    {paginatedDeliveries.length === 0 ? (
                        <div className="text-center p-4">No Active Deliveries</div>
                    ) : (
                        paginatedDeliveries.map((item) => (
                            <div key={item.id} className="flex hover:bg-red-primary/5 font-sans text-slate-800 dark:text-slate-200">
                                <div className="flex items-center justify-center p-2 flex-1">
                                    {item.id}
                                </div>
                                <div className="flex items-center justify-center p-2 flex-1">
                                    {item.deliveryTime}
                                </div>
                                <div className="flex items-center justify-center p-2 flex-1">
                                    {formatDeliveryTime(item.deliveryDate)}
                                </div>
                                <div className="flex items-center justify-center p-2 flex-1">
                                    <Link key={item.id} href={`/courier/track/${item.id}`}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full text-sm h-auto py-2 px-4 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                                        >
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {deliveries.length > pageSize && (
                    <div className="flex justify-center mt-4">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={deliveries.length}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
