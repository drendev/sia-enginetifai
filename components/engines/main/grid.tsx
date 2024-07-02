"use client";

import EngineButton from "@/components/ui/index/button";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, ConfigProvider, Badge } from "antd";

export function EnginePage(){
    return(
        <>
            <ConfigProvider
            theme={{
                token: {
                colorPrimary: '#BB4747',
                colorLink: '#BB4747',
                colorText: '#BB4747',
                colorBorder: '#BB4747'
                },
            }}>
            <div className="h-full flex-col flex md:px-10">
                <div className="flex flex-col sm:flex-row md:gap-2">
                    <div className="flex-col md:flex-grow p-6">
                        <div className="flex flex-col gap-4">
                             
                            <div className="flex flex-col w-full h-52 rounded-2xl shadow-xl bg-red-primary bg-search bg-right-bottom bg-contain bg-no-repeat px-7 py-5 gap-2">
                            <h1 className="text-red-100 text-4xl font-sans font-extrabold"> Engines </h1>
                                
                            </div>
                            
                            <div className="flex justify-between gap-3">
                                
                                <Input 
                                className="shadow-inner font-sans font-semibold rounded-full"
                                size="large"
                                placeholder="Search Engine" 
                                prefix={<SearchOutlined />} />
                                
                            
                            <div className="flex w-48">
                                <EngineButton>
                                    Add Engine <PlusOutlined />
                                </EngineButton>
                            </div>
                            </div>
                            
                            <div className="grid grid-cols-1 justify-center gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                            <Badge.Ribbon key={1} text={'Low Stocks'} color="#BB4747" placement='start' className="opacity-80 p-1">
                            <div className="flex bg-white bg-[url('https://res.cloudinary.com/hnqdnvduj/image/upload/v1718955675/engines/qbtt4pzmoknfcouxlcud.jpg')]  bg-top bg-8 bg-no-repeat w-full h-44 rounded-xl shadow-md">
                                <div className="self-end w-full h-12 bg-red-primary/15 rounded-b-xl">
                                    <h3 className="text-gray-800 text-center"> Engine: <span className="font-semibold font-sans">LT763274</span></h3>
                                    <h3 className="text-gray-800 text-center"> Available: <span className="font-semibold font-sans">23</span></h3>
                                </div>
                            </div>
                            </Badge.Ribbon>
                            <div className="bg-white w-full h-44 rounded-xl shadow-md p-6">
                                Engine 1
                            </div>
                            <div className="bg-white w-full h-44 rounded-xl shadow-md p-6">
                                Engine 1
                            </div>
                            <div className="bg-white w-full h-44 rounded-xl shadow-md p-6">
                                Engine 1
                            </div>
                            <div className="bg-white w-full h-44 rounded-xl shadow-md p-6">
                                Engine 1
                            </div>
                            <div className="bg-white w-full h-44 rounded-xl shadow-md p-6">
                                Engine 1
                            </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0">

                    </div>
                </div>
            </div>
            </ConfigProvider>
        </>
    )
}