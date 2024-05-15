"use client"

import Image from "next/image";
import { CameraOutlined, FundOutlined, ProductFilled, SnippetsOutlined, SolutionOutlined, TruckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import UserHeader from "./userheader";
import { useRef, useState } from "react";
import { GetRef, Tour, TourProps } from "antd";

const DashboardHeader = () => {
    const ref1 = useRef<GetRef<any>>(null);
    const ref2 = useRef<GetRef<any>>(null);
    const ref3 = useRef<GetRef<any>>(null);

    const steps: TourProps['steps'] = [
        {
          title: 'Icon',
          description: 'Test description for icon.',
          target: () => ref1.current!,
        },
        {
          title: 'Navbars',
          description: 'Select icons to navigate to different features.',
          target: () => ref2.current!,
        },
        {
          title: 'Profile',
          description: 'Edit Profile and Logout.',
          target: () => ref3.current!,
        },
      ];

      const [open, setOpen] = useState<boolean>(true);

    return (
        <header className="stick-0 top-0 flex justify-between shadow-md w-auto">
            <span ref={ref1}>
            <div className="flex ml-5 py-3">
                <Image className="w-auto h-auto" src="/logo.png" width={60} height={50} alt=""/>
                <h1 className="ml-4 self-center font-bold tracking-wider text-lg">ENGINETIF<span className="text-red-900 font-bold">AI</span></h1>
            </div>
            </span>
            
            <div ref={ref2} className="flex justify-evenly pt-1">           
                <div className="group flex-wrap items-center flex w-28 justify-center cursor-pointer mx-1 border-b-4 border-solid border-red-primary">
                <ProductFilled className="text-red-primary text-2xl px-5" />
                <span className="text-xs text-center font-semibold hidden group-hover:block text-red-primary">Dashboard</span>
                </div>
                <div className="group flex-wrap items-center flex w-28 justify-center cursor-pointer hover:bg-red-50 mx-1 mb-1 rounded-md">
                <FundOutlined className="text-red-primary text-2xl px-5" />
                <span className="text-xs text-nowrap hidden group-hover:block text-red-primary">Data Visualization</span>
                </div>
                <div className="group flex-wrap items-center flex w-28 justify-center cursor-pointer hover:bg-red-50 mx-1 mb-1 rounded-md">
                <SnippetsOutlined className="text-red-primary text-2xl px-5" />
                <span className="text-xs text-center hidden group-hover:block text-red-primary">Manage Engines</span>
                </div>
                <div className="group flex-wrap items-center flex w-28 justify-center cursor-pointer hover:bg-red-50 mx-1 mb-1 rounded-md">
                <CameraOutlined className="text-red-primary text-2xl px-5" />
                <span className="text-xs text-center hidden group-hover:block text-red-primary"> Find Engine</span>
                </div>
                <div className="group flex-wrap items-center flex w-28 justify-center cursor-pointer hover:bg-red-50 mx-1 mb-1 rounded-md">
                <TruckOutlined className="text-red-primary text-2xl px-5" />
                <span className="text-xs text-nowrap hidden group-hover:block text-red-primary">Delivery Tracking</span>
                </div>
                <div className="group flex-wrap items-center flex w-28 justify-center cursor-pointer hover:bg-red-50 mx-1 mb-1 rounded-md">
                <SolutionOutlined className="text-red-primary text-2xl px-5" />
                <span className="text-xs text-center hidden group-hover:block text-red-primary">Employees</span>
                </div>
            </div>
            <span ref={ref3}>
            <UserHeader />
            </span>
            <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
        </header>
        
    )
}

export default DashboardHeader;