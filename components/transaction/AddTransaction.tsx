"use client"

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, DatePicker, InputNumber, Select, AutoComplete, ConfigProvider, Switch, } from 'antd';
import dayjs from 'dayjs';

const FormSchema = z.object({
    transactionUser: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    quantity: z.any(),
    delivery: z.boolean(),
    deliveryDate: z.date().min(dayjs().startOf('day').toDate(), { message: 'Delivery Date is required' }),
    transactionMethod: z.string().min(5, 'Transaction Not Valid').max(30),
  })

  interface Engine {  
    price: number
    quantity: number,
    picture: string,
    description: string,
    engineType: string,
    engineName: string
  }

const AddTransaction = () => {
  const [engineName, setEngineName] = useState<string | undefined>(undefined)
  const [engine, setEngine] = useState<Engine | undefined>(undefined)
  const [calcQuantity, setTotalPrice] = useState<number>(0)
  const [data, setData] = useState([]);
  const [engineData, setEngineData] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user.username;

  const { Option } = Select;

  // fetch data

  useEffect(() => {
    const fetchData = async () => {
      if (!engineName) return setEngineName(undefined)

      const res = await fetch(`/api/enginelist?engineName=${engineName}`)
      const data = (await res.json()) as {price: number, quantity: number, picture: string, description: string, engineType: string, engineName: string}
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
      JSON.stringify(data)
      setEngineData(data.map((item: { engineName: any; }) => item.engineName))
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
      transactionMethod: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // update stock
    const responseStock = await fetch('/api/enginetransacted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        engineName: values.engineName,
        quantity: values.quantity,
      }),
    });

    // forward transaction data to database
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
        paymentMethod: values.transactionMethod,
      }),
    });

    if (response.ok && responseStock.ok) {
      router.push('/');
    } else {
      console.log('Something went wrong.');
    }
  };

  const handleSearch = (value: any) => {
    const filteredSuggestions = engineData.filter((d: any) =>
      d.includes(value)
    );  
    setData(filteredSuggestions);
  };  

  return (
    <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#BB4747',
                colorLink: '#BB4747',
              },
            }}>
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
        rules={[
          { required: true, message: "Please input your text!" },
        ]}
      >
        <AutoComplete
          options={data.map((option) => ({ value: option }))}
          onSearch={handleSearch}
          value={engineName}
          onChange={(value) => setEngineName(value)}
        />
      </Form.Item>

      <Form.Item
        label="Transaction Date"
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
        label="Transaction Method"
        name="transactionMethod"
        initialValue='Delivery'
      >
        <Select className='shadow-inner bg-slate-200'>
          <Option value={'Delivery'}>Delivery</Option>
          <Option value={'Cash'}>Cash</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Delivery"
        name="delivery"
        initialValue={false}
      >
          <Switch
          className='shadow-inner bg-slate-200'
          />
      </Form.Item>
      
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: 'Please input the quantity!' },
          () => ({
            validator(_, value) {
              if (value % 1 !== 0 && value > 0) {
                return Promise.reject('Invalid Quantity');
              }
              if (engine && value > engine?.quantity) {
                return Promise.reject('Quantity exceeds the available stock');
              }
              return Promise.resolve();
            },

          })
        ]}
      >
      <InputNumber
      min={1}
      value={calcQuantity}
      onChange={value => setTotalPrice(value || 0)}
      />
      </Form.Item>
      <Form.Item
        label="Total Transaction Price"
      >
        {engine && engine.price && calcQuantity <= engine.quantity && calcQuantity % 1 == 0 ? engine.price * calcQuantity : 'N/A'}
      </Form.Item>
      <Form.Item
        label="Available Stock"
      >
        {engine && engine.quantity ? engine.quantity : 'N/A'}
      </Form.Item>
      <Form.Item
        label="Engine Price"
      >
        {engine && engine.price ? engine.price : 'N/A'}
      </Form.Item>
      <img src={`${engine && engine?.picture ? engine.picture: null}`} alt={engine?.engineName} />
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
         type="primary" 
         htmlType="submit"
         className='bg-red-primary hover:bg-red-primary font-bold rounded-full text-md w-full h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
         >
          Add Transaction
        </Button>   
      </Form.Item>
    </Form>
    </ConfigProvider>
  );
}

export default AddTransaction;
