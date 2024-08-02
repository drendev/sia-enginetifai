"use client";

import { Button, ConfigProvider, Modal } from 'antd';
import { ActiveDeliveries } from "./activedeliveries"
import { DeliveriesOverview } from "./deliveriesoverview"
import { PendingDeliveries } from "./pendingdeliveries"
import { DeliveryGrowth } from "./deliverygrowth"
import { RecentDeliveries } from "./recentdeliveries"
import { useState } from 'react';

export function DeliveryPage() {
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return(
        <>
            <ConfigProvider
            theme={{
                token: {
                colorPrimary: '#BB4747',
                colorLink: '#BB4747',
                colorText: '#BB4747',
                colorBorder: '#BB4747'
                },
            }}>

                <div className="flex-col flex md:px-10">
                    <div className="flex flex-col sm:flex-row md:gap-2">
                        <div className="flex-col md:flex-grow p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col w-full h-52 rounded-2xl shadow-xl bg-red-primary bg-delivery bg-right-bottom bg-contain bg-no-repeat px-7 py-5 gap-2">
                                    <h1 className="text-red-100 text-4xl font-sans font-extrabold"> Deliveries </h1>
                                    <h3 className="text-red-100 text-xl font-sans font-extrabold pr-24 md:pr-0"> Track Deliveries in Real-Time </h3>
                                    <div className="mt-0 md:mt-10">
                                        <Button
                                            type="primary"
                                            htmlType="button"
                                            className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full md:w-72 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                                            onClick={showModal} // Show modal on button click
                                        >
                                            Terms & Conditions
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
                                    <ActiveDeliveries />
                                </div>
                                <div className="flex-col md:flex-grow">
                                    <div className="flex flex-col md:grid md:grid-cols-5 gap-5">
                                        <div className="col-span-1 md:col-span-5 md:space-y-5">
                                            <div className="bg-white dark:bg-slate-900 shadow-md md:h-48 rounded-xl p-4 mb-4">
                                                <DeliveriesOverview />
                                            </div>

                                            <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-48 w-full rounded-xl p-4">
                                                <DeliveryGrowth />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                            <div className="relative md:fixed pt-0 md:pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
                                <PendingDeliveries />
                                <RecentDeliveries />
                            </div>
                        </div>
                    </div>
                </div>

            </ConfigProvider>
        </>
    )
}