import { Form, Input } from 'antd';

const formItems = [
    { label: "Inlet(inch)", name: "Inlet" },
    { label: "Outlet(inch)", name: "Outlet" },
    { label: "Max.capacity(m3/h)", name: "MaxCapacity" },
    { label: "Max.discharge head(m)", name: "MaxDischarge" },
    { label: "Self-priming time(S/4m)", name: "SelfPrimingTime" },
    { label: "Max.suction head(m)", name: "MaxSuctionHead" },
    { label: "Engine Model", name: "EngineModel" },
    { label: "Fuel tank capacity(L)", name: "FuelTankCapacity" },
    { label: "Dimension(LxWxH)(mm)", name: "Dimension" },
    { label: "Net weight(recoil)(kg)", name: "NetWeight" },
    { label: "Package Dimension(LxWxH)(mm)", name: "PackageDimension" },
    { label: "Gross weight(kg)", name: "GrossWeight" },
    { label: "Loading Qty 20GP/40HQ (pcs)", name: "LoadingQty" }
];
export function GasolineWaterPump() {
    return (
        <>
            {formItems.map(item => (
                <Form.Item
                    key={item.name}
                    label={item.label}
                    name={item.name}
                    rules={[{ required: true, message: 'Required Specification' }]}
                >
                    <Input />
                </Form.Item>
            ))}
        </>
    );
}
