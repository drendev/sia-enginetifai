"use client";
import Upload from "./form";
import { Button, ConfigProvider, Spin, notification, Progress, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ProgressProps } from 'antd';
import Link from 'next/link';
import EngineTypeFeature from "./enginefeature";

interface Label {
    Name: string;
    Confidence: number;
}

type NotificationType = 'error';

export function ImageRecognitionPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [labels, setLabels] = useState<Label[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();

    // handle errors notification
    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: 'The image could not be processed.',
            description: 'Please try again with a different engine image.',
            showProgress: true,
            pauseOnHover: true,
        });
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setLabels([]); // Clear labels when a new file is selected
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) return;

        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageBase64 = reader.result?.toString().split(',')[1];

            try {
                const response = await fetch('/api/imagerecog', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageBase64 }),
                });

                if (!response.ok) {
                    throw new Error('Error fetching image recognition data');
                }

                const data = await response.json();
                setLabels(data.CustomLabels || []);
                if (!data.CustomLabels || data.CustomLabels.length === 0) {
                    openNotificationWithIcon('error');
                }
            } catch (err: any) {
                openNotificationWithIcon('error');
            } finally {
                setLoading(false);
            }
        };

        reader.readAsDataURL(selectedFile);
    };

    const conicColors: ProgressProps['strokeColor'] = {
        '0%': '#B79494',
        '50%': '#D27D7D',
        '80%': '#D05B5B',
        '100%': '#BB4747',
    };

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#BB4747',
                        colorLink: '#BB4747',
                        colorText: '#BB4747',
                        colorBorder: '#BB4747',
                        colorBgContainerDisabled: 'bg-red-800',
                    },
                }}
            >
                {contextHolder}
                <div className="flex-col flex md:px-10">
                    <div className="flex flex-col sm:flex-row md:gap-2">
                        <div className="flex-col md:flex-grow p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col w-full h-52 rounded-2xl shadow-xl bg-red-primary bg-imagerecog bg-right-bottom bg-contain bg-no-repeat px-7 py-5 gap-2">
                                    <h1 className="text-red-100 text-4xl font-sans font-extrabold"> Engine Recognition </h1>
                                    <h3 className="text-red-100 text-xl font-sans font-extrabold"> Identify Engine Type </h3>
                                    <div className="mt-10 md:mt-10">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full md:w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                                        >
                                            Terms of use
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                                    <div className="w-full 2xl:w-full h-[25rem] bg-white dark:bg-slate-900 shadow-md rounded-xl p-4">
                                        {/* Image Recognition Form */}
                                        <form onSubmit={handleSubmit}>
                                            <Upload onFileSelect={handleFileSelect} />
                                            <div className='p-6'>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full w-full text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                                                    disabled={!selectedFile || loading}
                                                >
                                                    {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Process Image'}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="flex-col md:flex-grow">
                                        <div className="flex flex-col md:grid md:grid-cols-5 gap-5">
                                            <div className="col-span-1 md:col-span-5 md:space-y-5">
                                                <div className="bg-white dark:bg-slate-900 shadow-md md:h-44 rounded-xl p-4 mb-4">
                                                    <h1 className='text-red-900 font-sans font-bold text-xl pb-2'> Engine Information </h1>
                                                    {labels.length > 0 ? (
                                                        <div className="flex">
                                                            {labels.map((label, index) => (
                                                                <div className="flex" key={index}>
                                                                    <div className="font-sans px-8">
                                                                        <h3 className="text-red-950 dark:text-slate-300 font-sans font-bold text-lg">Detected Engine Type</h3>
                                                                        <span className="font-semibold text-xl text-red-primary/90">{label.Name}</span>
                                                                    </div>
                                                                    <div className="label-confidence">
                                                                        <Tooltip color="#BB4747" title={`Confidence Percentage`}>
                                                                            <Progress
                                                                                percent={parseFloat(label.Confidence.toFixed(2))}
                                                                                type="circle"
                                                                                status="active"
                                                                                size={110}
                                                                                strokeColor={conicColors}
                                                                            />
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center font-sans px-8 text-red-950 dark:text-slate-400 text-md">
                                                            No engine image processed
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-52 w-full rounded-xl p-4">
                                                <h1 className='text-red-900 font-sans font-bold text-xl pb-2'> Engine Features </h1>
                                                <EngineTypeFeature engineType={labels[0]?.Name} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                            <div className="relative md:fixed pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">

                            </div>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
}
