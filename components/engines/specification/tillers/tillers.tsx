import {Form, Input, Col, Row} from "antd";

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
        <Row gutter={[12, 12]}>
            {formItems.map(item => (
                <Col xs={10} sm={12} md={8} key={item.name}>
                <Form.Item
                    key={item.name}
                    wrapperCol={{ span: 24 }}
                    name={item.name}
                    rules={[{ required: true, message: 'Required Specification' }]}
                >
                    <Input
                    placeholder={item.label}
                    />
                </Form.Item>
                </Col>
            ))}
        </Row>
        </>
    )
}