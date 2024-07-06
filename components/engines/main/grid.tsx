"use client";

import EngineButton from "@/components/ui/index/button";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, ConfigProvider, Badge } from "antd";
import { EngineList } from "./enginelist";
import { RecentEngineAdded } from "./recentadded";
import { RecentEngineTransaction } from "./recenttransaction";

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
                            <EngineList />
                        </div>
                        
                    </div>
                    <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                        <div className="relative md:fixed pt-6 h-[calc(100vh-96px)] overflow-y-auto scrollbar scrollbar-thumb-red-primary scrollbar-track-transparent">
                        <RecentEngineAdded />
                        <RecentEngineTransaction />
                        </div>
                    </div>
                </div>
            </div>
            </ConfigProvider>
        </>
    )
}