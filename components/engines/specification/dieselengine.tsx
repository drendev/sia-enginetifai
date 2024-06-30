import { Form, Input } from 'antd';

export function DieselEngine() {
  return (
    <>
        <Form.Item
        label="Bore x Stroke(mm)"
        name="BorexStroke"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Displacement(cc)"
        name="Displacement"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Engine Speed(rpm)"
        name="EngineSpeed"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Rated output(hp)"
        name="RatedOutput"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Max.output(hp)"
        name="MaxOutput"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Lube oil capacity(L)"
        name="LubeOilCapacity"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Fuel tank capacity(L)"
        name="FuelTankCapacity"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Fuel consumption(g/kW.h)"
        name="FuelConsumption"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Dimension(LxWxH)(mm)"
        name="Dimension"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Net weight(recoil)(kg)"
        name="NetWeight"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Package dimension (LxWxH)(mm)"
        name="PackageDimension"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Gross Weight (kg)"
        name="GrossWeight"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>

        <Form.Item
        label="Loading Qty 20GP/40HQ (pcs)"
        name="LoadingQty"
        rules={[{ required: true, message: 'Required Specification' }]}
        >
        
        <Input />
        </Form.Item>
    </>
  );
}