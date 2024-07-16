"use client";

import { Select, Statistic } from 'antd';
import React, { useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

export function ComparativeAnalysis() {
    const { Option } = Select;
    const [timeframe, setTimeframe] = useState("daily");

    return(
        <>
        <div className="flex justify-between">
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>Comparative Analysis</h1>
            <Select
                defaultValue="daily"
                style={{ width: 120, marginBottom: 20 }}
                onChange={(value) => setTimeframe(value)}
            >
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
            </Select>
        </div>
        <div className='grid grid-cols-2'>
            <div className='font-sans text-slate-900'>
                Everyday average transactions last month vs this month.
            </div>
            <div className='text-center pt-5'>
                <Statistic
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
                />
            </div>
        </div>
        </>
    )
}