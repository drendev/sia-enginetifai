"use client"

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Form, DatePicker, InputNumber, Select, AutoComplete, ConfigProvider, Switch, Image, Badge, } from 'antd';
import dayjs from 'dayjs';
import EngineButton from '../ui/index/button';
import Grid from '../ui/engineforms/FormGrid';

const FormSchema = z.object({
    transactionUser: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    quantity: z.any(),
    delivery: z.boolean(),
    deliveryDate: z.date().min(dayjs().startOf('day').toDate(), { message: 'Delivery Date is required' }),
    transactionMethod: z.string().min(5, 'Transaction Not Valid').max(30),
  })

  interface Engine {  
    price: number[],
    quantity: number[],
    picture: string[],
    description: string[],
    engineType: string[],
    engineName: string[]
  }

const AddTransaction = () => {
  const [engineName, setEngineName] = useState<string[]>([]);
  const [engine, setEngine] = useState<Engine[]>([]);
  const [calcQuantity, setTotalPrice] = useState<number[]>([]);
  const [engineData, setEngineData] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user.username;

  const { Option } = Select;

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!engineName) return setEngineName([])

      const queryString = engineName.map(name => `engineName=${name}`).join('&');
      const res = await fetch(`/api/enginelist?${queryString}`, {
        method: 'POST',
      });
      
      const data = await res.json() as Engine[];
      setEngine(data)
    }

    fetchData()
  }, [engineName])

  useEffect(() => {
    const fetchEngineData = async () => {
        
      const res = await fetch('/api/findengine',{
        method: 'POST'
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
    const formattedDate = dayjs(values.deliveryDate).format('YYYY-MM-DD');

    const transactions = engineName.map((engineName, index) => ({
      engineName,
      quantity: calcQuantity[index],
    }));
    // update stock
    const responseStock = await fetch('/api/enginetransacted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions
      }),
    });
    // forward transaction data to database
    const response = await fetch('/api/addtransac', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionUser: user,
        engineNames: transactions.map((transaction) => transaction.engineName),
        quantity: transactions.map((transaction) => transaction.quantity),
        delivery: values.delivery,
        deliveryDate: formattedDate,
        paymentMethod: values.transactionMethod,
      }),
    });

    if (responseStock.ok && response.ok) {
      router.push('/');
    } else {
      console.log('Something went wrong.');
    }
  };
  // Quantity
  const handleQuantityChange = (index: number, value: number) => {
    const newQuantities = [...calcQuantity];
    newQuantities[index] = value;
    setTotalPrice(newQuantities);
  };

  return (
    <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#BB4747',
                colorLink: '#BB4747',
              },
              components:{
                Form:{
                  itemMarginBottom: 10,
                  inlineItemMarginBottom: 10,
                  colorText: 'dark:text-gray-900',
                  labelColor: 'dark:text-gray-900',
                  marginLG: 4,
                }
              }
            }}>
    <Form
      className='flex flex-col md:flex-row max-w-screen-xl mx-auto gap-4 px-2'
      onFinish={onSubmit}
      autoComplete="off"
      requiredMark={false}
      wrapperCol={{ span: 16 }}
      layout='inline'
    >
      
      <Grid>
      <Form.Item
        label="Engine Name"
        name="engineName"
        rules={[
          { required: true, message: "Please input your text!" },
        ]}
      >
        <Select
          mode='multiple'
          maxCount={10}
          options={engineData.map((option) => ({ value: option }))}
          value={engineName}
          onChange={(value) => setEngineName(value)}
        />
      </Form.Item>
      <Form.Item
        label="Engine Type"
      >
        {engine && engine.map((engine, index) => (
          <p key={index}>{engine.engineName}: {engine.engineType}</p>
        ))}
      </Form.Item>
      <Form.Item
        label="Engine Image"
      >
        {engine && engine.map((engine, index) => (
        <Badge.Ribbon key={index} text={engine?.engineName} color="#BB4747" placement='start'>
        <Image key={index} src={`${engine && engine?.picture}`} width={120} height={120} className='rounded-lg'/>
        </Badge.Ribbon>
        ))}
      </Form.Item>
      <Form.Item
        label="Available Stock"
      >
        {engine && engine.map((engine, index) => (
          <p key={index}>{engine.engineName}: {engine.quantity}</p>
        ))}
      </Form.Item>
      <Form.Item
        label="Engine Price"
      >
        {engine && engine.map((engine, index) => (
          <p key={index}>{engine.engineName}: {engine.price}</p>
        ))}
      </Form.Item>
      
      </Grid>
      <Grid>
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
        className='flex-1'
        label="Transaction Method"
        name="transactionMethod"
        initialValue='Delivery'
      >
        <Select>
          <Option value={'Cash on Delivery'}>Delivery</Option>
          <Option value={'Paid in Store'}>Paid in Store</Option>
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
      {engine && engine.map((engine, index) => (
      <Form.Item
        label={`Quantity ${engine.engineName}`}
        name={`quantity_${index}`}
        key={index}
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
        value={calcQuantity[index] || 1}
        onChange={value => handleQuantityChange(index, value || 0)}
      />
      </Form.Item>
      ))}

      <Form.Item
        label="Total Transaction Price"
      >
        {engine && engine.map((engine, index) => (
          <p key={index}>{engine.engineName}: {calcQuantity[index] * Number(engine.price)}</p>
        ))}
      </Form.Item>
        <EngineButton>
        Add Transaction  
        </EngineButton>   
      </Grid>

    </Form>
    </ConfigProvider>
  );
} 

export default AddTransaction;
