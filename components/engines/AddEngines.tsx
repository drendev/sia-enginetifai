'use client'

import * as z from 'zod';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Form, Input, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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
    const { data: session } = useSession();
    const router = useRouter();
    const [file, setFile] = useState<File | undefined>();

    const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API;
    const user = session?.user.username;
    
    const {setValue} = useForm<z.infer<typeof FormSchema>>({
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
      
      if (!file) return;

      const formData = new FormData();
  
      formData.append("file", file);
      formData.append('upload_preset', `${uploadPreset}`);
      formData.append('api_key', `${apiKey}`);

      const results = await fetch('https://api.cloudinary.com/v1_1/hnqdnvduj/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json());
      console.log(results.secure_url);
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
          picture: results.secure_url,
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

      const normFile = (e: any) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };  
      function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement & {
          files: FileList
        }
        setFile(target.files?.[0])
      }
      const handleBeforeUpload = (file: File) => {
        setFile(file);
        setValue('picture', file.name);
        return false; // Prevent auto upload
      };
    console.log(file)
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
      rules={[{ required: true, message: 'Please input Engine Name' }]}
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
      rules={[{ required: true, message: 'Please input Engine Quantity' }]}
    >
      <InputNumber />
    </Form.Item>
    <Form.Item
      label="Price"
      name="price"
      rules={[{ required: true, message: 'Please input Engine Price' }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please input Description' }]}
    >
      
      <Input />
    </Form.Item>
    <Form.Item
      name="picture"
      label="Engine Image"
      valuePropName="fileList"
      getValueFromEvent={normFile}
      extra="Upload Engine Image"
      rules={[{ required: true, message: 'Please Upload Engine Image' }]}
    >
      <Upload name="picture" accept='image/*' listType="picture" maxCount={1} beforeUpload={handleBeforeUpload}>
        <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
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