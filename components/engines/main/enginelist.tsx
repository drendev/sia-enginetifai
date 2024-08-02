import React, { useState, useEffect } from 'react';
import { Input, ConfigProvider, Badge, Pagination, Empty, Select, Button, Skeleton, Drawer, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import moment from 'moment-timezone';
import * as XLSX from 'xlsx';

interface Engine {
    id: number,
    engineName: string,
    engineType: string,
    price: number,
    quantity: number,
    picture: string,
}

interface ScrapEngine {
    id: number,
    engineName: string,
    quantity: number,
    reason: string,
    user: string,
    createAt: string,
}

// Utility function to create options with the same label and value
const createOptions = (values: string[]) => {
    return values.map(value => ({ value, label: value }));
};

export function EngineList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [engineData, setEngineData] = useState<Engine[]>([]);
    const [scrapData, setScrapData] = useState<ScrapEngine[]>([]);
    const [search, setSearch] = useState('');
    const [selectedEngineType, setSelectedEngineType] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        // Simulate a data fetch
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust the timeout duration as needed
    }, []);

    const pageSize = 8;
    const scrapPageSize = 10;

    const utcDate = new Date();
    const timeZone = 'Asia/Manila';
  
    const dateToday = moment.tz(utcDate, timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  
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

    useEffect(() => {
        const fetchScrapData = async () => {
            const res = await fetch('/api/engines/scrapengines', {
              method: 'POST',
            });
            const data = await res.json();
            const sortedData = data.sort((a: ScrapEngine, b: ScrapEngine) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
            setScrapData(sortedData);
        };
        fetchScrapData();
      }, []);

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

    const handleScrapPageChange = (page: number) => {
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

    const showDrawer = () => {
        setIsDrawerVisible(true);
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
    };

    const showModal = (reason: string) => {
        setModalContent(reason);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(scrapData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ScrapEngines');
        XLSX.writeFile(wb, `scrap_engines_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
    };

    const currentScrapData = scrapData.slice((currentPage - 1) * scrapPageSize, currentPage * scrapPageSize);

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
                    <span className='text-md font-sans text-red-800 font-semibold'> Filter: </span>
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
                    <Button
                        className='flex bg-red-primary hover:bg-red-primary font-semibold rounded-lg w-28 text-md h-auto py-2 px-5 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                        type='primary'
                        onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    <Button
                        className='flex bg-red-primary hover:bg-red-primary font-semibold rounded-lg w-28 text-md h-auto py-2 px-5 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2 ml-2'
                        type='primary'
                        onClick={showDrawer}>
                        Scrap Engines
                    </Button>
                </div>
                <Skeleton loading={loading} active>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 mb-4">
                        {currentEngines.length > 0 ? currentEngines.map(engine => (
                            engine.quantity < 15 ? (
                                <div key={engine.id} className='hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md hover:rounded-xl'>
                                    <Badge.Ribbon key={engine.id} text={'Low Stocks'} color="#BB4747" placement='start' className="opacity-80 p-1">
                                        <Link key={engine.id} href={`/engines/${engine.id}`}>
                                            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden h-44">
                                                <div className="w-full h-32">
                                                    <img src={engine.picture} alt={engine.engineName} className="object-cover w-full h-full"/>
                                                </div>
                                                <div className="flex-1 pb-2 bg-slate-50 dark:bg-slate-900">
                                                    <h3 className="text-gray-800 dark:text-slate-300 text-center">
                                                        <span className="font-bold font-sans text-sm">{engine.engineName}</span>
                                                    </h3>
                                                    <h3 className="text-gray-800 dark:text-slate-300 text-center">
                                                        <span className="font-semibold font-sans text-sm">Available:</span> 
                                                        <span className='text-red-primary'>{engine.quantity}</span>
                                                    </h3>
                                                </div>
                                            </div>
                                        </Link>
                                    </Badge.Ribbon>
                                </div>
                            ) : (
                                <div key={engine.id} className='hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md hover:rounded-xl'>
                                        <Link key={engine.id} href={`/engines/${engine.id}`}>
                                            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden h-44">
                                                <div className="w-full h-32">
                                                    <img src={engine.picture} alt={engine.engineName} className="object-cover w-full h-full"/>
                                                </div>
                                                <div className="flex-1 pb-2 bg-slate-50 dark:bg-slate-900">
                                                    <h3 className="text-gray-800 dark:text-slate-300 text-center">
                                                        <span className="font-bold font-sans text-sm">{engine.engineName}</span>
                                                    </h3>
                                                    <h3 className="text-gray-800 dark:text-slate-300 text-center">
                                                        <span className="font-semibold font-sans text-sm">Available:</span> 
                                                        <span className='text-red-primary'>{engine.quantity}</span>
                                                    </h3>
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
                <Drawer
                    title="Scrap Engines"
                    placement="right"
                    closable={true}
                    onClose={closeDrawer}
                    open={isDrawerVisible}
                    size='large'
                >
                    <div className="w-full mb-4">
                    <button onClick={exportToExcel} className="bg-red-primary text-white px-4 py-2 rounded">
                        Export to Excel
                    </button>
                    </div>
                    <div className="w-full">
                    <div className="bg-red-primary/15 flex font-bold">
                        <div className="text-left p-2 flex-1">ID</div>
                        <div className="text-left p-2 flex-1">Engine</div>
                        <div className="text-left p-2 flex-1">Quantity</div>
                        <div className="text-left p-2 flex-1">User</div>
                        <div className="text-left p-2 flex-1">Reason</div>
                        <div className="text-left p-2 flex-1">Time</div>
                    </div>
                    <div className="divide-y">
                        {currentScrapData.map((item) => (
                            <div key={item.id} className="flex hover:bg-red-primary/5">
                            <div className="p-4 flex-1">
                                {item.id}
                            </div>
                            <div className="p-4 flex-1">
                                {item.engineName}
                            </div>
                            <div className="p-4 flex-1">
                                {item.quantity}
                            </div>
                            <div className="p-4 flex-1">
                                {item.user}
                            </div>
                            <div className="p-4 flex-1">
                                {item.reason.length > 10 ? (
                                    <>
                                        {item.reason.substring(0, 10)}...
                                        <Button type="link" onClick={() => showModal(item.reason)}>see more</Button>
                                    </>
                                ) : (
                                    item.reason
                                )}
                            </div>
                            <div className="p-4 flex-1">
                            {formatTransactionTime(item.createAt)}
                            </div>
                            </div>
                        ))}
                    </div>
                    </div>
                    {scrapData.length > scrapPageSize && (
                        <div className="text-center">
                            <Pagination
                                current={currentPage}
                                pageSize={scrapPageSize}
                                total={scrapData.length}
                                onChange={handleScrapPageChange}
                            />
                        </div>
                    )}
                </Drawer>
                <Modal
                    title="Reason"
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <p>{modalContent}</p>
                </Modal>
            </ConfigProvider>
        </>
    );
}
