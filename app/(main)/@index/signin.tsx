
import Image from "next/image";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const Signin: React.FC = () =>  {

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
      };
    return (
        <>
            <div className="flex flex-auto relative md:ml-40 h-69 bg-gray-primary w-full rounded-2xl border-solid border-opacity-75 border-1 border-[#ababab] border-r-6 border-b-6 rounded-r-2xl rounded-b-xl">
                <div className="flex-col h-96 w-80 p-10">   
                    <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    >
                        <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                    
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <a className="login-form-forgot" href="">
                            Forgot password
                            </a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
    </>
    )
}

export default Signin;