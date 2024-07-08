import {Form, Input, Row, Col} from 'antd';

const formItems = [
    { label: "Max.AC Output(Kw)", name: "MaxACOutput" },
    { label: "Rate.AC Outpput(Kw)", name: "RateACOutput" },
    { label: "Noise(dB/7m)", name: "Noise" },
    { label: "Fuel Tank Capacity(L)", name: "FuelTankCapacity" },
    { label: "Running Time At 50% Loading(H)", name: "RunningTime" },
    { label: "Dimension(LxWxH mm)", name: "Dimension" },
    { label: "Net Weight(Kg)", name: "NetWeight" },
    { label: "Optional", name: "Optional" },
    { label: "Engine Model", name: "EngineModel" },
    { label: "Engine Type", name: "EngineType" },
    { label: "Starting System", name: "StartingSystem" },
    { label: "Bore x Stroke (mm)", name: "BorexStroke" },
    { label: "Displacement(cc)", name: "Displacement" },
    { label: "Fuel Consumption(g/kWh)", name: "FuelConsumption" },
]
export function InverterGenerator() {
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