import { Form, Input } from "antd";

const formItems = [
    { label: "Voltage (V)", name: "Voltage" },
    { label: "Frequency (Hz)", name: "Frequency" },
    { label: "Rate.AC output (kW)", name: "RateACOutput" },
    { label: "Max.AC output (kW)", name: "MaxACOutput" },
    { label: "Power Factor cosφ", name: "PowerFactor" },
    { label: "DC output (V/A)", name: "DCOutput" },
    { label: "Fuel Consumption (g/kW h)", name: "Fuel Consumtion" },
    { label: "Noise (7 meters away)dB(A)", name: "Noise" },
    { label: "No load voltage(V)", name: "NoLoadVoltage" },
    { label: "Operating welding voltage(V)", name: "OperatingWelding" },
    { label: "Operating current(A)", name: "OperatingCurrent" },
    { label: "Max.Arcing current(A)", name: "MaxArcingCurrent" },
    { label: "Duty Cycle(A)", name: "DutyCycle" },
    { label: "Engine Model", name: "EngineModel" },
    { label: "Starting System", name: "StartingSystem" },
    { label: "Lube oil capacity (L)", name: "LubeOilCapacity" },
    { label: "Fuel tank capacity (L)", name: "FuelTankCapacity" },
    { label: "Dimension (LxWxH) (mm)", name: "Dimension" },
    { label: "NetWeight(recoil)(kg)", name: "NetWeight" },
    { label: "Package Dimension (LxWxH)(mm)", name: "PackageDimension" },
    { label: "Gross weight(kg)", name: "GrossWeight" },
    { label: "Loading Quantity 20GP/40HQ (pcs)", name: "LoadingQty" }
];

export function DieselWeldingGenerator() {
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
