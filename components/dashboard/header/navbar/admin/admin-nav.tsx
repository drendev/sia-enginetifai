"use client"

import { NavButton, NavIcon, NavLabel } from "../nav-utils";
import { ProductFilled, FundOutlined, CameraOutlined, TruckOutlined, 
ProductOutlined, FundFilled, CameraFilled, TruckFilled, ProfileOutlined, ProfileFilled } from "@ant-design/icons";
import { usePathname } from "next/navigation";

const NavUtils = [
    {key: 0, label: 'Dashboard', path: '/', icon: <ProductOutlined />, activeIcon: <ProductFilled />},
    {key: 1, label: 'Data Visualization', path: '/datavisualization', icon: <FundOutlined />, activeIcon: <FundFilled />},
    {key: 2, label: 'Find Engine', path: '/findengine', icon: <CameraOutlined />, activeIcon: <CameraFilled />},
    {key: 3, label: 'Delivery Tracking', path: '/deliverytracking', icon: <TruckOutlined />, activeIcon: <TruckFilled />},
    {key: 4, label: 'Employees', path: '/employees', icon: <ProfileOutlined />, activeIcon: <ProfileFilled />},
]

export const NavAdmin = () => {
    const pathName = usePathname();

    return(
        <>
           {NavUtils.map((labels) => { 
            const isActive = pathName === labels.path || pathName.startsWith(labels.path.length > 1 ? labels.path : labels.path + '/');

            return(
                <NavButton
                key={labels.key}
                path={labels.path}
                active={isActive}
                >
                <NavIcon
                active={isActive}
                >
                    {isActive ? labels.activeIcon : labels.icon}
                </NavIcon>
                <NavLabel>
                    {labels.label}
                </NavLabel>
                </NavButton>
            )}
           )}
        </>
    )
}