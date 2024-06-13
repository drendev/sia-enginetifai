"use client"

import * as z from 'zod';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';

const FormSchema = z.object({
    transactionUser: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    quantity: z.any(),
    delivery: z.boolean(),
    deliveryDate: z.date().min(dayjs().startOf('day').toDate(), { message: 'Delivery Date is required' })
  })

const AddTransaction = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user.username;

  const { Option } = Select;


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
        <Input />
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
      <InputNumber />
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
