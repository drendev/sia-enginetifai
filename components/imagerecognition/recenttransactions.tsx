import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Skeleton } from 'antd';
import Link from 'next/link';

interface EngineTypeTransaction {
    totalPrice: number;
    transactionId: number;
    transactionDate: string;
    quantity: number;
}

interface EngineTypeTransactionProps {
    engineType: string;
    loading: boolean;
}

const RecentTransactions: React.FC<EngineTypeTransactionProps> = ({ engineType, loading }) => {
    const [transactions, setTransactions] = useState<EngineTypeTransaction[]>([]);

    const utcDate = new Date();
    const timeZone = 'Asia/Manila';

    const dateToday = moment.tz(utcDate, timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch(`/api/enginetypes/recenttransaction?engineType=${engineType}`, {
                method: 'POST',
                body: JSON.stringify({ engineType }),
            });
            const data = (await res.json()) as EngineTypeTransaction[];
            setTransactions(data);
        };

        if (engineType) {
            fetchEngineData();
        } else {
            setTransactions([]);
        }
    }, [engineType, loading]);
    
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

    return (
        <>
            <Skeleton className='pt-10' loading={loading} active>
                <div className="text-md">
                    <div className="w-full">
                        {transactions.length > 0 && (
                            <div className="bg-red-primary/15 flex font-bold">
                                <div className="text-left p-4 flex-1">Quantity</div>
                                <div className="text-left p-4 flex-1">Total Sales</div>
                                <div className="text-left p-4 flex-1">Time</div>
                            </div>
                        )}
                        <div className="divide-y">
                            {transactions.length === 0 ? (
                                <div className="p-4 text-center text-red-950">No transactions found.</div>
                            ) : (
                                transactions.map((transaction) => (
                                    <Link key={transaction.transactionId} href={'test'}>
                                        <div key={transaction.transactionId} className="flex hover:bg-red-primary/5">
                                            <div className="p-4 flex-1">
                                                {transaction.quantity} pcs.
                                            </div>
                                            <div className="p-4 flex-1">
                                                ₱ {transaction.totalPrice}
                                            </div>
                                            <div className="p-4 flex-1">{formatTransactionTime(transaction.transactionDate)}</div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Skeleton>
        </>
    );
};

export default RecentTransactions;
