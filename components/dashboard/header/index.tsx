import Image from "next/image";
import { CameraOutlined, FundOutlined, ProductFilled, SnippetsOutlined, SolutionOutlined, TruckOutlined } from "@ant-design/icons";
import UserHeader from "./userheader";

const DashboardHeader = () => {
    return (
        <header className="stick-0 top-0 flex justify-between shadow-md">
            <div className="flex ml-5 py-3">
                <Image src="/logo.png" width={60} height={50} alt=""/>
                <h1 className="ml-4 self-center font-bold tracking-wider text-lg">ENGINETIF<span className="text-red-900 font-bold">AI</span></h1>
            </div>
            <div className="flex justify-evenly pt-1">
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
            <UserHeader />
        </header>
    )
}

export default DashboardHeader;