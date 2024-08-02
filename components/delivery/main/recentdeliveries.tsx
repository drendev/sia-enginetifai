"use client";

import { useEffect, useState } from "react";
import { Button, Pagination } from 'antd';
import Link from 'next/link';

interface RecentDeliveries {
    id: number;
    deliveryDate: string;
    transactionUser: string;
}

export function RecentDeliveries() {
    const [deliveries, setDelivery] = useState([] as RecentDeliveries[]);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 5; // Number of transactions per page

    useEffect(() => {
        const fetchActiveDeliveryData = async () => {
            const res = await fetch('/api/delivery/recentdeliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            const sortedData = data.sort((a: RecentDeliveries, b: RecentDeliveries) => 
                new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
            );

            setDelivery(sortedData);
        };

        fetchActiveDeliveryData();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Paginate the deliveries array
    const paginatedDeliveries = deliveries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Function to format the date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return(
        <>
            <div className="w-[28rem]">
                <h1 className='text-red-900 font-sans font-bold text-xl py-2'>Recent Deliveries</h1>
                <div className="w-full text-sm">
                    <div className="bg-red-primary/15 font-sans flex font-bold">
                        <div className="p-2 flex-1"> ID </div>
                        <div className="p-2 flex-1"> Transac Staff </div>
                        <div className="p-2 flex-1"> Delivery Date </div>
                    </div>
                    <div className="divide-y">
                        {paginatedDeliveries.length === 0 ? (
                            <div className="text-center p-4">No Recent Deliveries</div>
                        ) : (
                            paginatedDeliveries.map((item) => (
                                <Link key={item.id} href={`/deliverytracking/delivery/${item.id}`}>
                                    <div className="flex hover:bg-red-primary/5 font-sans text-slate-800 dark:text-slate-200">
                                        <div className="justify-center p-2 flex-1">
                                            {item.id}
                                        </div>
                                        <div className="justify-center p-2 flex-1">
                                            {item.transactionUser}
                                        </div>
                                        <div className="justify-center p-2 flex-1">
                                            {formatDate(item.deliveryDate)}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
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
        </>
    )
}
