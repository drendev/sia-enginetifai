"use client";

import { useSession, signIn } from "next-auth/react";
import { Button, Modal, Form, Input, ConfigProvider } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Profile {
    username: string;
    email: string;
}
export default function Page() {
    const { data: session, update } = useSession();
    const currentUserProfile = session?.user?.picture;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values: any) => {
        try {
            const response = await fetch('/api/editprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    username: values.username,
                })
                
            });
            const data = await response.json();

            if (response.ok) {
                const updatedUser = await response.json();
                update({ user: updatedUser });
                setIsModalVisible(false);
            } else {
                console.log('Something went wrong.');
            }
        } catch (error) {
            console.error('Error:', error);
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
                <div className="pt-20 pb-16 md:pb-0">
                    <div className="items-center mx-auto flex flex-col">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row items-center justify-between w-full md:w-[50rem] h-auto rounded-2xl shadow-xl bg-enginebackground bg-right-bottom bg-contain bg-no-repeat bg-red-primary px-7 py-5 gap-2">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-red-100 text-4xl font-sans font-extrabold"> My Profile </h1>
                                    <h3 className="text-red-100 text-xl font-sans font-bold pt-5"> {session?.user?.username} </h3>

                                    <Button
                                        type="primary"
                                        className="bg-red-primary/90 hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                                        onClick={showModal}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                                <div className="pr-6">
                                    <div className="relative w-28 h-auto justify-center">
                                        <img src={`${currentUserProfile}`} className="rounded-full" alt="" width={100} height={100} />
                                        <Link className="text-red-50" href={"/upload-picture"}> Change Profile Picture</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-48 w-full rounded-xl p-4">
                                <h1 className="text-red-900 dark:text-red-100 font-sans font-bold text-xl pb-2">Profile Details</h1>
                                <div className="grid grid-cols-2 pt=2">
                                    <div className="space-y-2">
                                        <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className="font-bold"> Email Address: </span> {session?.user?.email} </h3>
                                        <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className="font-bold"> Role: </span> {session?.user?.role} </h3>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className="font-bold"> Username: </span> {session?.user?.username} </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title="Edit Profile"
                    open={isModalVisible}
                    onOk={form.submit}
                    onCancel={handleCancel}
                >
                    <Form
                        form={form}
                        name="editProfile"
                        onFinish={handleSubmit}
                        initialValues={{
                            email: session?.user?.email,
                            username: session?.user?.username,
                            role: session?.user?.role,
                        }}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="role"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Form>
                </Modal>
            </ConfigProvider>
        </>
    );
}
