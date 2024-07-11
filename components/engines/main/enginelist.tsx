import React, { useState, useEffect } from 'react';
import { Input, ConfigProvider, Badge, Pagination, Empty, Select, Button, Skeleton } from 'antd';
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

// Utility function to create options with the same label and value
const createOptions = (values: string[]) => {
    return values.map(value => ({ value, label: value }));
};

export function EngineList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [engineData, setEngineData] = useState<Engine[]>([]);
    const [search, setSearch] = useState('');
    const [selectedEngineType, setSelectedEngineType] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a data fetch
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust the timeout duration as needed
    }, []);

    const pageSize = 8;

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch('/api/engines/allenginelist', {
                method: 'POST'
            });
            const data = await res.json();
            setEngineData(data);

            // Reset pagination to page 1 when data changes due to search
            setCurrentPage(1);
        };

        fetchEngineData();
    }, [search, selectedEngineType, selectedStock]); // Include search, selectedEngineType, and selectedStock in dependencies

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const clearFilters = () => {
        setSelectedEngineType(null);
        setSelectedStock(null);
    };

    const filteredEngines = engineData.filter(engine => {
        const matchesSearch = engine.engineName.toLowerCase().includes(search.toLowerCase());
        const matchesEngineType = selectedEngineType ? engine.engineType === selectedEngineType : true;
        const matchesStock = selectedStock === 'Low Stock' ? engine.quantity < 15 : selectedStock === 'High Stock' ? engine.quantity >= 15 : true;
        return matchesSearch && matchesEngineType && matchesStock;
    });

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
                        Pagination: {
                            colorBgContainer: 'bg-white dark:bg-slate-900',
                        }
                    }
                }}>
                <div className="flex justify-between gap-3 mb-4">
                    <Input
                        className="bg-white shadow-inner font-sans font-semibold rounded-full"
                        size="large"
                        placeholder="Search Engine"
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Link href="/engines/AddEngines" className='flex w-48'>
                    <Button
                        type="primary" 
                        htmlType="submit"
                        className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                        >
                        Add Engine <PlusOutlined />
                    </Button>
                    </Link>
                </div>
                <div className='flex justify-start gap-2 mb-4'>
                    <span className='text-lg font-sans text-red-800 font-semibold'> Filter: </span>
                    <Select
                        showSearch
                        className='w-72'
                        placeholder="Types of Engine"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={createOptions([
                            'Diesel Engine', 'Twin-Cylinder Diesel Engine','Open Type Diesel Generator', 'Silent Diesel Generator', 'Twin-Cylinder Diesel Generator',
                            'Diesel Water Pump', 'Diesel High Pressure Pump', 'Diesel Iron Pump', 'Gasoline Engine', 'Gasoline Twin-Cylinder Engine', 'Gasoline Twin-Vertical Engine',
                            'Open Type Gasoline Generator', 'Silent Gasoline Generator', 'Twin-Cylinder Gasoline Generator', 'Liquified Petroleum Gas & LPT Generator',
                            'Portable Gasoline Generator', 'Gasoline Water Pump', 'Gasoline High Pressure Pump', 'Gasoline Iron Pump', 'Gasoline Trash Pump', 
                            'Inverter Generator', 'Diesel Welding Generator', 'Gasoline Welding Generator', 'Tillers'
                        ])}
                        onChange={(value) => setSelectedEngineType(value)}
                        value={selectedEngineType}
                    />
                    
                    <Select
                        placeholder="Engine Stock"
                        options={createOptions(['High Stock', 'Low Stock'])}
                        onChange={(value) => setSelectedStock(value)}
                        value={selectedStock}
                    />
                    <div className='hidden md:block'>
                    <Button
                    className='flex bg-red-primary hover:bg-red-primary font-semibold rounded-lg w-28 text-md h-auto py-2 px-5 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                    type='primary'
                    onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    </div>
                    </div>
                    <div className='block md:hidden'>
                    <Button
                    className='flex bg-red-primary hover:bg-red-primary font-semibold rounded-lg w-28 text-md h-auto py-2 px-5 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                    type='primary'
                    onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    </div>
                    <Skeleton loading={loading} active>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 mb-4">
                        {currentEngines.length > 0 ? currentEngines.map(engine => (
                            engine.quantity < 15 ? (
                                <div key={engine.id} className='hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md hover:rounded-xl'>
                                    <Badge.Ribbon key={engine.id} text={'Low Stocks'} color="#BB4747" placement='start' className="opacity-80 p-1">
                                        <Link key={engine.id} href={`/engines/${engine.id}`}>
                                            <div className="flex bg-white dark:bg-slate-900 bg-top bg-8 bg-no-repeat w-full h-44 rounded-xl shadow-md" style={{ backgroundImage: `url(${engine.picture})` }}>
                                                <div className="self-end w-full h-12 bg-red-primary/15 rounded-b-xl">
                                                    <h3 className="text-gray-800 dark:text-slate-300 text-center"> <span className="font-bold font-sans text-sm">{engine.engineName}</span></h3>
                                                    <h3 className="text-gray-800 dark:text-slate-300 text-center"> <span className="font-semibold font-sans text-sm">Available:</span> <span className='text-red-primary'>{engine.quantity}</span></h3>
                                                </div>
                                            </div>
                                        </Link>
                                    </Badge.Ribbon>
                                </div>
                            ) : (
                                <div key={engine.id} className='hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md hover:rounded-xl'>
                                    <Link key={engine.id} href={`/engines/${engine.id}`}>
                                        <div className="flex bg-white dark:bg-slate-900 bg-top bg-8 bg-no-repeat w-full h-44 rounded-xl shadow-md" style={{ backgroundImage: `url(${engine.picture})` }}>
                                            <div className="self-end w-full h-12 bg-red-primary/15 rounded-b-xl">
                                                <h3 className="text-gray-800 dark:text-slate-300 text-center"> <span className="font-bold font-sans text-sm">{engine.engineName}</span></h3>
                                                <h3 className="text-gray-800 dark:text-slate-300 text-center"> <span className="font-semibold font-sans text-sm">Available:</span> <span className='text-red-primary text-sm'>{engine.quantity}</span></h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        )) : (
                            <div className="flex justify-center items-center col-span-full h-full md:h-72">
                                <Empty className="text-center" description="No engine found" />
                            </div>
                        )}
                    </div>
                    
                {filteredEngines.length > 0 && (
                    <div className="text-center">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredEngines.length}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
                </Skeleton>
            </ConfigProvider>
        </>
    );
}
