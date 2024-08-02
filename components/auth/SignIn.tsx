'use client';

import { Button, Form, Input, ConfigProvider, notification, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

  type NotificationType = 'error'; // Error notification type

  const FormSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  });
  
  const SignInForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Log in Credentials Error',
      showProgress: true,
      pauseOnHover: true,
      description:
        'Invalid username or password. Please try again.',
    });
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const signInData = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    })
    if(signInData?.error) {
      openNotificationWithIcon('error');
      setLoading(false);
    } else {
      router.refresh();
    }
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
      {contextHolder}
      <div className="flex flex-col relative pa justify-center mt-5 lg:mt-0 md:mt-0 lg:ml-40 h-69 bg-white rounded-2xl border-solid border-opacity-75 border-1 border-[#ababab] border-r-6 border-b-6 rounded-r-2xl rounded-b-xl">
        <div className="flex flex-col w-80 lg:w-80 lg:h-80 p-5 m-auto text-center"> 
            <h1 className="text-2xl font-extrabold text-red-primary mb-5">SIGN IN</h1>
            <Form
              className="justify-center"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              requiredMark={false} 
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input
                  placeholder="Username"
                  className="p-2 px-5 rounded-full shadow-inner"
                  autoComplete="off"
                  />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input
                  type="password"
                  placeholder="Password"
                  className="py-2 px-5 rounded-full shadow-inner" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-red-primary hover:bg-red-primary font-bold rounded-full text-md w-full h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                >
                  {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Log in'}
                </Button>
              </Form.Item>
            </Form>
          
        </div>
      </div>
      </ConfigProvider>
    </>
  );
}

export default SignInForm;