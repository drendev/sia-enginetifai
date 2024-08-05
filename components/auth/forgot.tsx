'use client';

import { Button, Form, Input, ConfigProvider, notification, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

type NotificationType = 'error' | 'success';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required'),
});

const OtpSchema = z.object({
  otp: z.string().min(6, 'OTP is required'),
});

const PasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ForgotPasswordOtp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState<string>('');

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, description: string) => {
    api[type]({
      message: type === 'error' ? 'Error' : 'Success',
      description,
    });
  };

  const onEmailSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const response = await fetch('/api/forgot/sendotp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
      }),
    });

    if (response.ok) {
      setEmail(values.email);
      setStep('otp');
      setLoading(false);
    } else {
      setLoading(false);
      openNotificationWithIcon('error', 'Invalid Email Address. Please try again.');
    }
  };

  const onOtpSubmit = async (values: z.infer<typeof OtpSchema>) => {
    setLoading(true);
    const response = await fetch('/api/forgot/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: values.otp,
      }),
    });

    if (response.ok) {
      setLoading(false);
      setStep('password');
    } else {
      setLoading(false);
      openNotificationWithIcon('error', 'Invalid OTP. Please try again.');
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof PasswordSchema>) => {
    setLoading(true);
    const response = await fetch('/api/forgot/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: values.password,
      }),
    });

    if (response.ok) {
      setLoading(false);
      openNotificationWithIcon('success', 'Password reset successfully.');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setLoading(false);
      openNotificationWithIcon('error', 'Error resetting password. Please try again.');
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
        }}
      >
        {contextHolder}
        <div className="flex flex-col relative pa justify-center mt-5 lg:mt-0 md:mt-0 lg:ml-40 h-69 bg-white rounded-2xl border-solid border-opacity-75 border-1 border-[#ababab] border-r-6 border-b-6 rounded-r-2xl rounded-b-xl">
          <div className="flex flex-col w-80 lg:w-80 lg:h-80 p-5 m-auto text-center">
            <h1 className="text-2xl font-extrabold text-red-primary mb-5">FORGOT PASSWORD</h1>
            {step === 'email' ? (
              <Form
                className="justify-center"
                initialValues={{ remember: true }}
                onFinish={onEmailSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input Email Address' }]}
                >
                  <Input
                    placeholder="Email Address"
                    className="p-2 px-5 rounded-full shadow-inner"
                    autoComplete="off"
                    max={30}
                    maxLength={30}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-red-primary hover:bg-red-primary font-bold rounded-full text-md w-full h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                  >
                    {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Verify'}
                  </Button>
                </Form.Item>
              </Form>
            ) : step === 'otp' ? (
              <Form
                className="justify-center"
                initialValues={{ remember: true }}
                onFinish={onOtpSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please input OTP' }]}
                >
                  <Input
                    placeholder="OTP"
                    className="p-2 px-5 rounded-full shadow-inner"
                    autoComplete="off"
                    max={6}
                    maxLength={6}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-red-primary hover:bg-red-primary font-bold rounded-full text-md w-full h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                  >
                    {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Submit OTP'}
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Form
                className="justify-center"
                initialValues={{ remember: true }}
                onFinish={onPasswordSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input new password' }]}
                >
                  <Input.Password
                    placeholder="New Password"
                    className="p-2 px-5 rounded-full shadow-inner"
                    autoComplete="off"
                    min={8}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Please confirm new password' }]}
                >
                  <Input.Password
                    placeholder="Confirm New Password"
                    className="p-2 px-5 rounded-full shadow-inner"
                    autoComplete="off"
                    min={8}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-red-primary hover:bg-red-primary font-bold rounded-full text-md w-full h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                  >
                    {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Reset Password'}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default ForgotPasswordOtp;
