"use client";

import { CameraOutlined } from "@ant-design/icons";
import { Input, ConfigProvider, Badge, Button } from "antd";
import { EngineList } from "./enginelist";
import { RecentEngineAdded } from "./recentadded";
import { RecentEngineTransaction } from "./recenttransaction";
import Link from "next/link";

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
            
            <div className="flex-col flex md:px-10">
                <div className="flex flex-col sm:flex-row md:gap-2">
                    <div className="flex-col md:flex-grow p-6">
                        <div className="flex flex-col gap-4">
                             
                            <div className="flex flex-col w-full h-52 rounded-2xl shadow-xl bg-red-primary bg-search bg-right-bottom bg-contain bg-no-repeat px-7 py-5 gap-2">
                            <h1 className="text-red-100 text-4xl font-sans font-extrabold"> Engines </h1>
                            <div className="mt-20 md:mt-14">
                            <Link href={'/engines/imagerecog'}>
                            <Button
                            type="primary" 
                            htmlType="submit"
                            className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full md:w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                            >
                            Engine Recognition <CameraOutlined />
                            </Button>
                            </Link>
                            </div>
                            </div>
                            <EngineList />
                        </div>
                        
                    </div>
                    <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                        <div className="relative md:fixed pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
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