import {Form, Input, Row, Col} from 'antd';

const formItems = [
    { label: "Displacement(cc) (BorexStroke)(mm)", name: "DisplacementBore" },
    { label: "Net Power (under SAE J1349)", name: "NetPower" },
    { label: "Kw/3600 rpm", name: "Kw3600" },
    { label: "Kw/3000 rpm", name: "Kw3000" },
    { label: "Kw/2600 rpm", name: "Kw2600" },
    { label: "Max Net Torque(Nm/rpm)(under SAE J1349)", name: "MaxNetTorque" },
    { label: "Compression Ratio", name: "CompressionRatio" },
    { label: "Idle Speed", name: "Idle Speed" },
    { label: "Fuel Tank Capacity(L)", name: "FuelTankCapacity" },
    { label: "Engine Oil Capacity(L)", name: "EngineOilCapacity" },
    { label: "Net weight(kg)", name: "NetWeight" },
    { label: "Size(LxWxH)", name: "Size" },
]
export function GasolineVertical() {
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