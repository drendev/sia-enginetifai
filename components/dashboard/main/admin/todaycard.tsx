import { TodaysActivityItem } from "./todaysactivity";
import Link from 'next/link'
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';

interface TodaysActivityCardProps {
    item: TodaysActivityItem;
}

export function TodayCard({item}: TodaysActivityCardProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a data fetch
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust the timeout duration as needed
    }, []);
    return(
        <Link href={`${item.href}`}>
            <div className={`bg-red-primary ${item.background} bg-contain bg-no-repeat bg-right-bottom h-20 w-full rounded-xl shadow-xl p-4 pl-7 hover:-translate-y-1 transition-all cursor-pointer`}>
                <h3 className="text-lg uppercase font-extrabold text-red-100">
                    {item.title}
                </h3>
                <div className="text-lg font-light text-red-100">
                    {item.number}
                </div>
            </div>
        </Link>
    )
}