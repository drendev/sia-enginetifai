'use client'

import { FormEvent } from 'react'
import * as z from 'zod';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Form, Input, InputNumber } from 'antd';

const FormSchema = z
.object({
  userName: z.string().min(5, 'Username Max Limit.').max(30),
  engineName: z.string().min(5, 'Engine Max Limit.').max(30),
  engineType: z.string().min(8, 'Engine Type is required').max(100),
  price: z.number().min(1, 'Price is required').max(100),
  quantity: z.number().min(1, 'Quantity is required').max(100),
  picture: z.string().min(5, 'Picture is required').max(100),
  description: z.string().min(5, 'Description is required').max(250),
})

const AddEngine = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = session?.user.username;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        userName: '',
        engineName: '',
        engineType: '',
        price: 0,
        quantity: 0,
        picture: '',
        description: '',
        },
    });
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const response = await fetch('/api/addengine',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            userName: user,
            engineName: values.engineName,
            engineType: values.engineType,
            price: values.price,
            quantity: values.quantity,
            picture: values.picture,
            description: values.description,
            })
        })
    
        if(response.ok){
            router.push('/')
        }
        else {
            console.log('Something went wrong.');
        }
        };
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
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Engine Type"
      name="engineType"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Quantity"
      name="quantity"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <InputNumber />
    </Form.Item>
    <Form.Item
      label="Price"
      name="price"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      
      <Input />
    </Form.Item>
    <Form.Item
      label="Picture"
      name="picture"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  )
    }
  export default AddEngine;