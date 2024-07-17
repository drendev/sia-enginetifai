"use client";

import { Select, Skeleton, Statistic } from 'antd';
import React, { useState, useEffect } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

interface MonthlyData {
    dailyAverage: number;
    weeklyAverage: number;
}

interface ComparativeAnalysisData {
    currentMonth: MonthlyData;
    lastMonth: MonthlyData;
    dailyPercentageChange: string;
    weeklyPercentageChange: string;
}

export function ComparativeAnalysis() {
    const { Option } = Select;
    const [timeframe, setTimeframe] = useState("daily");
    const [data, setData] = useState<ComparativeAnalysisData | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/transactions/comparativeanalysis', {
                    method: 'POST'
                });
                const result: ComparativeAnalysisData = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    if (!data) {
        return <Skeleton active />;
    }

    const value = timeframe === "daily" ? parseFloat(data.dailyPercentageChange) : parseFloat(data.weeklyPercentageChange);
    const isPositive = value > 0;
    const valueStyle = isPositive ? { color: 'green' } : { color: 'red' };
    const prefix = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;

    return (
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
                    {timeframe === "daily"
                        ? "Everyday average transactions last month vs this month."
                        : "Weekly average transactions last month vs this month."
                    }
                </div>
                <div className='text-center pt-5'>
                    <Statistic
                        value={value}
                        precision={2}
                        valueStyle={valueStyle}
                        prefix={prefix}
                        suffix="%"
                    />
                </div>
            </div>
        </>
    );
}
