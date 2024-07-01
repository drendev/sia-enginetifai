import {Form, Input} from "antd";

const formItems = [
    { label: "Dimensions(mm)", name: "Dimensions" },
    { label: "Tilling Width(mm)", name: "TillingWidth" },
    { label: "Tilling Depth(mm)", name: "TillingDepth" },
    { label: "Shifting Gears", name: "ShiftingGears" },
    { label: "Transmission Mode", name: "TransmissionMode" },
    { label: "Engine Model", name: "EngineModel" },
    { label: "Displacement(cc)", name: "Displacement" },
    { label: "Max Output(hp.kw/rpm)", name: "MaxOutput" },
    { label: "Starting System", name: "StartingSystem" },
    { label: "Transporting Wheels", name: "TransportingWheel" },
    { label: "Tilling Blades", name: "TillingBlades" },
    { label: "Cont.Load (20 GP)", name: "ContLoad20" },
    { label: "Cont.Load (40 HQ)", name: "ContLoad40" },
]
export function Tillers() {
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
    )
}