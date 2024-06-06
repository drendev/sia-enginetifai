"use client";

import { FormEvent } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

const FormSchema = z.object({
  engineId: z.string().min(1, 'Engine ID is requiredd'),

  deliveryDate: z.date().refine(date => date >= new Date(), 'Delivery date must be in the future'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const AddTransaction = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      engineId: '',
      deliveryDate: new Date(),
      deliveryAddress: '',
      quantity: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/addtransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
        deliveryDate: values.deliveryDate.toISOString(), 
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
      onFinish={form.handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <Form.Item
        label="Engine ID"
        name="engineId"
        rules={[{ required: true, message: 'Please input the engine ID!' }]}
      >
        <Input {...form.register('engineId')} />
      </Form.Item>

      <Form.Item
        label="Delivery Date"
        name="deliveryDate"
        rules={[{ required: true, message: 'Please select the delivery date!' }]}
      >
        <DatePicker
          onChange={(date) => form.setValue('deliveryDate', date ? date.toDate() : new Date())}
          defaultValue={moment()}
        />
      </Form.Item>

      <Form.Item
        label="Delivery Address"
        name="deliveryAddress"
        rules={[{ required: true, message: 'Please input the delivery address!' }]}
      >
        <Input {...form.register('deliveryAddress')} />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: 'Please input the quantity!' }]}
      >
        <Input type="number" {...form.register('quantity')} />
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
