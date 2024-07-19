"use client";
import Upload from "./form";
import { Button, ConfigProvider, Spin, notification, Progress, Tooltip, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ProgressProps } from 'antd';
import Link from 'next/link';
import EngineTypeFeature from "./enginefeature";
import EngineModels from "./enginemodels";
import RecentTransactions from "./recenttransactions";

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
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

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

                return data;
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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#BB4747',
                        colorLink: '#BB4747',
                        colorText: 'text-slate-700',
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
                                            htmlType="button"
                                            className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full md:w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                                            onClick={showModal} // Show modal on button click
                                        >
                                            Terms of use
                                        </Button>
                                        <Modal 
                                            title="Terms of Use for Image Recognition Service" 
                                            open={isModalVisible} 
                                            onCancel={handleCancel} 
                                            footer={null} // Remove default footer
                                        >
                                            <p>
                                                <div>
                                                <div className="font-bold"> 1. Image Upload Requirements</div>
                                                <div>
                                                1.1. The Service only supports image files uploaded in the following file extensions: .jpg, .jpeg, .png, jfif, and .webp.
                                                </div>
                                                <div>
                                                1.2. The quality and accuracy of the image recognition depend significantly on the quality and capture of the uploaded images. Users are advised to upload clear and high-resolution images for better recognition results.
                                                </div>
                                                </div>
                                                <div>
                                                <div className="font-bold"> 2. Detection Accuracy</div>
                                                <div>
                                                2.1. The accuracy of the image recognition may vary based on the quality of the uploaded image. The Service aims to provide accurate detection; however, it may not be accurate all the time.
                                                </div>
                                                <div>
                                                2.2. The Service provides a confidence level for each detection. Any confidence level below 70% is not guaranteed to be accurate. Users should interpret these results with caution and should not rely solely on the Service for critical decisions.
                                                </div>
                                                </div>
                                                <div>
                                                <div className="font-bold"> 3. Limitations of the Service</div>
                                                <div>
                                                3.1. The Service is designed to detect engine types only. It does not support the detection of other objects or categories.
                                                </div>
                                                <div>
                                                3.1. We do not guarantee that the Service will be error-free, uninterrupted, or free from unauthorized access. We will not be liable for any loss or damage caused by your reliance on the accuracy or timeliness of the information provided by the Service.
                                                </div>
                                                <div>
                                                3.2. Users are responsible for ensuring that the images they upload comply with the supported file extensions and quality requirements specified in these Terms of Use.
                                                </div>
                                                </div>
                                            </p>
                                            
                                        </Modal>
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
                                                                <div className="flex">
                                                                    <div className="font-sans px-8">
                                                                        <h3 className="text-red-950 dark:text-slate-300 font-sans font-bold text-lg">Detected Engine Type</h3>
                                                                        <span className="font-semibold text-xl text-red-primary/90">{labels[0].Name}</span>
                                                                    </div>
                                                                    <div className="label-confidence">
                                                                        <Tooltip color="#BB4747" title={`Confidence Percentage`}>
                                                                            <Progress
                                                                                percent={parseFloat(labels[0].Confidence.toFixed(2))}
                                                                                type="circle"
                                                                                status="active"
                                                                                size={110}
                                                                                strokeColor={conicColors}
                                                                            />
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
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
                            <div className="relative md:fixed pt-0 md:pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
                                <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-[19rem] w-full md:w-[29rem] rounded-xl p-4">
                                    <h1 className='text-red-900 font-sans font-bold text-xl pb-2'> Engine Models </h1>
                                    <EngineModels 
                                    engineType={labels[0]?.Name} 
                                    loading={loading} />
                                </div>

                                <div className="px-5 py-3">
                                <div className='text-red-900 font-sans font-bold text-xl pb-2'>
                                Recent Transactions 
                                </div>
                                    <RecentTransactions 
                                    engineType={labels[0]?.Name}
                                    loading={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
}