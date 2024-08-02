"use client";

import { Button, ConfigProvider, Modal } from 'antd';
import { ActiveDeliveriesCourier } from "@/components/delivery/courier/activedeliveries"
import { DeliveriesOverview } from "@/components/delivery/main/deliveriesoverview"
import { PendingDeliveriesCourier } from "@/components/delivery/courier/pendingdeliveries"
import { DeliveryGrowth } from "@/components/delivery/main/deliverygrowth"
import { useState } from 'react';
import { RecentDeliveries } from '../main/recentdeliveries';

export function CourierPage() {
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
                                                <div className="font-bold"> 1. Service Description</div>
                                                Our delivery tracking service allows users to monitor the status and location of their deliveries in real-time. The service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied.
                                                </div>
                                                <div>
                                                <div className="font-bold"> 2. User Responsibilities</div>
                                                <div>
                                                2.1. Account Information: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                                                </div>
                                                <div>
                                                2.2. Accuracy of Information: You agree to provide accurate, current, and complete information when using our service and to update your information to keep it accurate and complete..
                                                </div>
                                                </div>
                                                <div>
                                                <div className="font-bold"> 3. Privacy</div>
                                                Your use of the service is also governed by our Privacy Policy, which is incorporated into these Terms and Conditions by this reference. Please review our Privacy Policy to understand our practices regarding your personal data.
                                                </div>
                                            </p>
                                            
                                        </Modal>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                                <div className="w-full 2xl:w-full h-[25rem] bg-white dark:bg-slate-900 shadow-md rounded-xl p-4">
                                    <ActiveDeliveriesCourier />
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
                                <PendingDeliveriesCourier />
                                <RecentDeliveries />
                            </div>
                        </div>
                    </div>
                </div>

            </ConfigProvider>
        </>
    )
}