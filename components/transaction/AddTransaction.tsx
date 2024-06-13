"use client"

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, DatePicker, InputNumber, Select, AutoComplete } from 'antd';
import dayjs from 'dayjs';

const FormSchema = z.object({
    transactionUser: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    quantity: z.any(),
    delivery: z.boolean(),
    deliveryDate: z.date().min(dayjs().startOf('day').toDate(), { message: 'Delivery Date is required' })
  })

  type Engine = {
    map(arg0: (user: any, index: any) => any): import("react").ReactNode;
    filter(arg0: (arg0: (d: any) => boolean) => any): any;
    engineName?: string;
  }

const AddTransaction = () => {
  const [engineName, setEngineName] = useState<string | undefined>(undefined)
  const [engine, setEngine] = useState<{ price: number } | undefined>(undefined)
  const [calcQuantity, setTotalPrice] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string | undefined>(undefined)
  const [data, setData] = useState<string[]>([]);
  const [engineData, setEngineData] = useState<Engine | null>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user.username;

  const { Option } = Select;

  // fetch data

  useEffect(() => {
    const fetchData = async () => {
      if (!engineName) return setEngineName(undefined)

      const res = await fetch(`/api/enginelist?engineName=${engineName}`)
      const data = (await res.json()) as {price: number}
      setEngine(data)
    }

    fetchData()
  }, [engineName])

  useEffect(() => {
    const fetchEngineData = async () => {
        
      const res = await fetch('/api/findengine',{
        method: 'GET'
      })
      const data = await res.json() 
      setEngineData(data)
    }

    fetchEngineData()
  }, [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {  
      transactionUser: '',
      engineName: '',
      quantity: 1,
      delivery: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    const response = await fetch('/api/addtransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionUser: user,
        engineName: values.engineName,
        quantity: values.quantity,
        delivery: values.delivery,
        deliveryDate: values.deliveryDate,
      }),
    });

    if (response.ok) {
      router.push('/');
    } else {
      console.log('Something went wrong.');
    }
  };

  const normalArray = JSON.parse(engineData.engineName || '[]');

  const handleSearch = (value: any) => {
    if (!value || value === "") {
      setData([]);
    } else {
      setData(normalArray.filter((d: any) => d.includes(value)) || []);
    }
  };  

console.log(norm);

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Engine Name"
        name="engineName"
        rules={[{ required: true, message: 'Please input the engine ID!' }]}
      >
        <Input
        value={engineName}
        onChange={(e) => setEngineName(e.target.value)}
        />  
      </Form.Item>

      <Form.Item
        label="Input"
        name="input"
        rules={[
          { required: true, message: "Please input your text!" },
        ]}
      >
        <AutoComplete
          options={data.map((option) => ({ value: option }))}
          onSearch={handleSearch}
          value={inputValue}
          onChange={(value) => setInputValue(value)}
        />
      </Form.Item>

      <Form.Item
        label="Delivery Date"
        name="deliveryDate"
        rules={[{ required: true, message: 'Please select the delivery date!' }]}
        initialValue={dayjs()
        }
      >
        <DatePicker 
          format={'DD/MM/YYYY'}
          onChange={(date) => form.setValue('deliveryDate', date.toDate())}
        />
      </Form.Item>

      <Form.Item
        label="Delivery"
        name="delivery"
        initialValue={false}
      >
        <Select>
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: 'Please input the quantity!' }]}
      >
      <InputNumber
      min={1}
      value={calcQuantity}
      onChange={value => setTotalPrice(value || 1)}
      />
      </Form.Item>
      <Form.Item
        label="Price"
      >
        {engine && engine.price ? engine.price * calcQuantity : 'N/A'}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddTransaction;
