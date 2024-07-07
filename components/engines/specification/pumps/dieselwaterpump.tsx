import { Form, Input, Row, Col } from 'antd';

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
export function DieselWaterPump() {
    return (
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
    );
}
