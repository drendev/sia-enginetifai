import { NavButton, NavIcon, NavLabel } from "../nav-utils";
import { ProductFilled, FundOutlined, CameraOutlined, TruckOutlined, SolutionOutlined } from "@ant-design/icons";


export const NavAdmin = () => {
    return(
        <>
            <NavButton active>
                <NavIcon>
                    <ProductFilled />
                </NavIcon>
                <NavLabel>
                    Dashboard
                </NavLabel>
            </NavButton>

            <NavButton>
                <NavIcon>
                    <FundOutlined />
                </NavIcon>
                <NavLabel>
                    Data Visualization
                </NavLabel>
            </NavButton>

            <NavButton>
                <NavIcon>
                    <CameraOutlined />
                </NavIcon>
                <NavLabel>
                    Find Engine
                </NavLabel>
            </NavButton>

            <NavButton>
                <NavIcon>
                    <TruckOutlined />
                </NavIcon>
                <NavLabel>
                    Delivery Tracking
                </NavLabel>
            </NavButton>

            <NavButton>
                <NavIcon>
                    <SolutionOutlined/>
                </NavIcon>
                <NavLabel>
                    Employees
                </NavLabel>
            </NavButton>
        </>

    )
}