import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Skeleton, Pagination, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface EngineModels {
    engineId: number;
    engineName: string;
    quantity: number;
    engineImage: string;
}

interface EngineTypeModelProps {
    engineType: string;
    loading: boolean;
}

const EngineModels: React.FC<EngineTypeModelProps> = ({ engineType, loading }) => {
    const [engine, setEngine] = useState<EngineModels[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const pageSize = 3;

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch(`/api/enginetypes/engines?engineType=${engineType}`, {
                method: 'POST'
            });
            const data = (await res.json()) as EngineModels[];
            setEngine(data);
            setCurrentPage(1);
        };

        if (engineType) {
            fetchEngineData();
        } else {
            setEngine([]);
        }
    }, [engineType, loading]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const filteredEngines = engine.filter(engine => engine.engineName.toLowerCase().includes(search.toLowerCase()));
    const paginatedEngines = filteredEngines.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            {engineType && (
                <div className="mb-4">
                    <Input
                        placeholder="Search Model"
                        value={search}
                        onChange={handleSearchChange}
                        prefix={<SearchOutlined />}
                    />
                </div>
            )}

            {engineType ? (
                filteredEngines.length > 0 ? (
                    <>
                    <Skeleton loading={loading} active>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                            {paginatedEngines.map((engine, index) => (
                                    <Link key={index} href={`/engines/${engine.engineId}`}>
                                        <div
                                            key={index}
                                            className="border border-gray-200 dark:border-slate-700 p-1 rounded-lg flex flex-col items-center hover:-translate-y-1 transition-all cursor-pointer hover:shadow-md w-full"
                                        >
                                            <img src={engine.engineImage} alt={engine.engineName} className="w-20 h-20 md:w-20 md:h-20 mb-2 rounded-lg" />
                                            <h4 className="text-sm font-semibold">{engine.engineName}</h4>
                                            <p className="text-sm text-gray-400">
                                                {engine.quantity} available
                                            </p>
                                        </div>
                                    </Link>
                            ))}
                        </div>
                        <div className="text-center mt-4">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredEngines.length}
                                onChange={handlePageChange}
                            />
                        </div> 
                        </Skeleton>
                    </>
                    
                ) : (
                    <Skeleton loading={loading} active>
                        <div className="text-center font-sans px-8 text-red-950 dark:text-slate-400 text-md">
                            No engine found
                        </div>
                    </Skeleton>
                )
            ) : (
                <Skeleton loading={loading} active>
                    <div className="text-center font-sans px-8 text-red-950 dark:text-slate-400 text-md">
                        No engine models processed
                    </div>
                </Skeleton>
            )}
        </>
    );
};

export default EngineModels;
