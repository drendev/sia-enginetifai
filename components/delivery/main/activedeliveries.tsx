"use client";
import { useEffect, useState } from "react";
import { Button, Pagination } from 'antd';
import Link from 'next/link';

interface ActiveDeliveries {
    id: number;
    deliveryDate: string;
    transactionUser: string;
}

export function ActiveDeliveries() {
    const [deliveries, setDelivery] = useState([] as ActiveDeliveries[]);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 5; // Number of transactions per page

    useEffect(() => {
        const fetchActiveDeliveryData = async () => {
            const res = await fetch('/api/delivery/activedeliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            const sortedData = data.sort((a: ActiveDeliveries, b: ActiveDeliveries) => 
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

    return (
        <>
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>Active Deliveries</h1>
            <div className="w-full text-sm">
                <div className="bg-red-primary/15 font-sans flex font-bold">
                    <div className="flex items-center justify-center p-2 flex-1">ID</div>
                    <div className="flex items-center justify-center p-2 flex-1"> Transac Staff</div>
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
                                    {item.transactionUser}
                                </div>
                                <div className="flex items-center justify-center p-2 flex-1">
                                    <Link key={item.id} href={`/deliverytracking/track/${item.id}`}>
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
