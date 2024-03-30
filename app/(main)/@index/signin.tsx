import { Button, Form, Input, ConfigProvider } from 'antd';

const Signin: React.FC = () =>  {

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
      };
    return (
        <>
            <div className="flex flex-col relative justify-center md:ml-40 h-69 bg-white w-full rounded-2xl border-solid border-opacity-75 border-1 border-[#ababab] border-r-6 border-b-6 rounded-r-2xl rounded-b-xl">
                <div className="flex flex-col h-80 w-80 p-5 m-auto text-center">
                <ConfigProvider
                        theme={{
                        token: {
                            colorPrimary: '#BB4747',
                            colorLink: '#BB4747',
                    },
                    }}>
                    <h1 className="text-2xl font-extrabold text-red-primary mb-5">SIGN IN</h1>
                    <Form
                    name="normal_login"
                    className="justify-center"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    >
                        <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input placeholder="Username" 
                            className="p-2 px-5 rounded-full"
                            />
                        </Form.Item>

                        <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                            type="password"
                            placeholder="Password"
                            className="py-2 px-5 rounded-full"
                            />
                        </Form.Item>
                    
                        <Form.Item>            
                                <Button
                                type="primary" 
                                htmlType="submit" 
                                className="bg-red-primary hover:bg-red-primary font-bold rounded-full text-md w-full h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2">
                                Log in
                                </Button>             
                        </Form.Item>
                        <Form.Item>
                            <a className="login-form-forgot text-red-primary" href="">
                            Forgot password
                            </a>
                        </Form.Item>
                    </Form>
                    </ConfigProvider>
                </div>
            </div>
            
    </>
    )
}

export default Signin;