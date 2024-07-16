"use client";

import { useState } from "react";
import { Select } from 'antd';

export function MyTransactions() {
    const { Option } = Select;
    const [status, setStatus] = useState("done");

    return(
        <>
            <div className="flex justify-between pt-3">
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'> My Transactions </h1>
            <Select
                defaultValue="done"
                style={{ width: 120, marginBottom: 20 }}
                onChange={(value) => setStatus(value)}
            >
                <Option value="active">Active</Option>
                <Option value="pending">Pending</Option>
                <Option value="done">Done</Option>
            </Select>
            </div>

            <div className="w-full">
                    <div className="bg-red-primary/15 flex font-bold">
                        <div className="text-left p-2 flex-1">Type</div>
                        <div className="text-left p-2 flex-1">Sales</div>
                        <div className="text-left p-2 flex-1">Time</div>
                    </div>
                    <div className="divide-y">
                        {/* {transaction.map((item) => (
                            <Link key={item.engineId} href={'test'}>
                                <div key={item.engineId} className="flex hover:bg-red-primary/5">
                                    <div className="p-4 flex-1">
                                        {item.engineName.length > 1 
                                            ? `${item.engineName[0]} +${item.engineName.length - 1}`
                                            : item.engineName[0]}
                                    </div>
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
                        ))} */}
                    </div>
                </div>
        </>
    )
}