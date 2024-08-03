import {Form, Input} from "antd";

const formItems = [
    { label: "Engine Model", name: "EngineModel" },
    { label: "Displacement", name: "Displacement" },
    { label: "Engine Rated Power", name: "EngineRatedPower" },
    { label: "Fuel Tank Capacity", name: "FuelTankCapacity" },
    { label: "Tilling Width", name: "TillingWidth" },
    { label: "Transmission Mode", name: "TransmissionMode" },
    { label: "Dimensions", name: "Dimensions" },
    { label: "Weight", name: "Weight" },
    { label: "Packing Size", name: "PackingSize" },
]
export function Gt400() {
    return(
        <>
            {formItems.map(item => (
                <Form.Item
                    key={item.name}
                    label={item.label}
                    name={item.name}
                    rules={[{ required: true, message: 'Required Specification' }]}
                >
                    <Input
                    maxLength={20}
                    />
                </Form.Item>
            ))}
        </>
    )
}