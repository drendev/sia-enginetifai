"use client";

import React, { useState, useEffect } from 'react';
import { Input, ConfigProvider, Badge, Pagination, Empty, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import EngineButton from "@/components/ui/index/button";
import Link from 'next/link';

interface Engine {
    id: number,
    engineName: string,
    engineType: string,
    price: number,
    quantity: number,
    picture: string,
}

export function EngineList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [engineData, setEngineData] = useState<Engine[]>([]);
    const [search, setSearch] = useState('');
    
    const pageSize = 8;

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch('/api/engines/allenginelist', {
                method: 'POST'
            });
            const data = await res.json();
            setEngineData(data);
        };

        fetchEngineData();
    }, []);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const filteredEngines = engineData.filter(engine => 
        engine.engineName.toLowerCase().includes(search.toLowerCase())
    );

    const currentEngines = filteredEngines.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#BB4747',
                        colorLink: '#BB4747',
                        colorText: '#BB4747',
                        colorBorder: '#BB4747'
                    },
                    components: {
                        Pagination: {}
                    }
                }}>
                <div className="flex justify-between gap-3">
                    <Input
                        className="shadow-inner font-sans font-semibold rounded-full"
                        size="large"
                        placeholder="Search Engine"
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Link href="/engines/AddEngines" className='flex w-48'>
                        <EngineButton>
                            Add Engine <PlusOutlined />
                        </EngineButton>
                    </Link>

                </div>
                <div className='justify-between space-x-4'>
                    <span className='text-lg font-sans text-red-800 font-semibold'> Filter: </span>
                <Select
                    showSearch
                    className='w-72'
                    placeholder="Types of Engine"
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={[
                    { value: 'Liquified Petroleum Gas & LPT Generator', label: 'Liquified Petroleum Gas & LPT Generator', }
                    ]}
                />
                <Select
                placeholder="Engine Stock"
                options={[
                { value: 'High Stock', label: 'High Stock' },
                { value: 'Low Stock', label: 'Low Stock' },
                ]}
                /> 
                </div>
                <div className="grid grid-cols-1 justify-center gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                    {currentEngines.length > 0 ? currentEngines.map(engine => (
                        engine.quantity < 15 ? (
                            <Badge.Ribbon key={engine.id} text={'Low Stocks'} color="#BB4747" placement='start' className="opacity-80 p-1">
                                <Link href={`/engines/${engine.id}`}>
                                    <div className="flex bg-white bg-top bg-8 bg-no-repeat w-full h-44 rounded-xl shadow-md" style={{ backgroundImage: `url(${engine.picture})` }}>
                                        <div className="self-end w-full h-12 bg-red-primary/15 rounded-b-xl">
                                            <h3 className="text-gray-800 text-center"> Engine: <span className="font-semibold font-sans">{engine.engineName}</span></h3>
                                            <h3 className="text-gray-800 text-center"> Available: <span className="font-semibold font-sans">{engine.quantity}</span></h3>
                                        </div>
                                    </div>
                                </Link>
                            </Badge.Ribbon>
                        ) : (
                            <div key={engine.id} className="bg-white w-full h-44 rounded-xl shadow-md p-6">
                                Engine: {engine.engineName}
                            </div>
                        )
                    )) : <Empty description="No engine found" />}
                </div>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredEngines.length}
                    onChange={handlePageChange}
                    className="mt-4 text-center"
                    
                />
            </ConfigProvider>
        </>
    );
}
