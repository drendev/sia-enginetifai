import {Form, Input} from 'antd';

const formItems = [
    { label: "Bore x Stroke (mm)", name: "BorexStroke" },
    { label: "Displacement(cc)", name: "Displacement" },
    { label: "Engine speed(rpm)", name: "EngineSpeed" },
    { label: "Rated output(hp)", name: "RatedOutput" },
    { label: "Max output(hp)", name: "MaxOutput" },
    { label: "Lube oil capacity(L)", name: "LubeOilCapacity" },
    { label: "Fuel tank capacity (L)", name: "FuelTankCapacity" },
    { label: "Fuel consumption(g/kW h)", name: "FuelConsumption" },
    { label: "Dimension(LxWxH)(mm)", name: "Dimension" },
    { label: "Net weight(recoil)(kg)", name: "NetWeight" },
    { label: "Package Dimension (LxWxH)(mm)", name: "PackageDimension" },
    { label: "Gross weight(kg)", name: "GrossWeight" },
    { label: "Loading Qty 20GP/40HQ (pcs)", name: "LoadingQty" },
];

export function GasolineEngine() {
    return(
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