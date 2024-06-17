'use client'

import * as z from 'zod';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Form, Input, InputNumber, Upload, ConfigProvider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import EngineButton from '../ui/index/button';

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

interface Engine {  
  engineName: string
}


const AddEngine = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [file, setFile] = useState<File | undefined>();
    const [engineName, setEngineName] = useState<string | undefined>(undefined)
    const [engine, setEngine] = useState<Engine | undefined>(undefined)

    const uploadPreset = process.env.NEXT_PUBLIC_ENGINE_PRESET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API;
    const user = session?.user.username;


    // Check Engine List
    useEffect(() => {
      const fetchData = async () => {
        if (!engineName) return setEngineName(undefined)
  
        const res = await fetch(`/api/enginelist?engineName=${engineName}`)
        const data = (await res.json()) as {engineName: string}
        setEngine(data)
      }
  
      fetchData()
    }, [engineName])  
    
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
      
      if (typeof file === "undefined") return;
      if (values.engineName === engine?.engineName) return;

      const formData = new FormData();
  
      formData.append("file", file);
      formData.append('upload_preset', `${uploadPreset}`);
      formData.append('api_key', `${apiKey}`);

      const results = await fetch('https://api.cloudinary.com/v1_1/hnqdnvduj/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json());

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

      const handleBeforeUpload = (file: File) => {
        setFile(file);
        setValue('picture', file.name);
        return false; // Prevent auto upload
      };
  return (  
    <>
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
      rules={[{ required: true, message: 'Please input Engine Name' },
        () => ({
          validator(_, value) {
            if (value === engine?.engineName) {
              return Promise.reject('Engine already exist');
            }
            return Promise.resolve();
          },

        })
      ]}
    >
      <Input 
        value={engineName}
        onChange={(e) => setEngineName(e.target.value)}
      />
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
      <EngineButton>
        Add Engine
      </EngineButton>
    </Form.Item>
  </Form>
  </ConfigProvider>
  </>
  )
    }
  export default AddEngine;