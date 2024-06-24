import { TodaysActivityItem } from "./todaysactivity";
import Link from 'next/link';

interface TodaysActivityCardProps {
    item: TodaysActivityItem;
}

export function TodayCard({item}: TodaysActivityCardProps) {
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