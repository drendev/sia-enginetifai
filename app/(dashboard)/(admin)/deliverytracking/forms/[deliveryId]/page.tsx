"use client";

import { ConfigProvider, Form, notification, Select, TimePicker, Spin, Badge, Carousel, Image  } from "antd";
import type { TimePickerProps } from 'antd';
import Grid from "@/components/ui/engineforms/FormGrid";
import { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import EngineButton from "@/components/ui/index/button";
import moment from 'moment-timezone';

const FormSchema = z.object({
    address: z.string().min(5, 'Address Error').max(60),
    deliveryUser: z.string().min(5, 'deliveryUser Error').max(20),
});

interface TransactionData {
    id: number;
    engineName: string[];
    quantity: number[];
    totalPrice: number;
    transactionUser: string;
    paymentMethod: string;
    delivery: boolean;
    deliveryDate: string;
    createAt: string;
    pictures: string[];
}

export default function Page({ params }: { params: { deliveryId: string } }) {
    const [deliveryUser, setDeliveryUser] = useState([]);
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const inputRef = useRef<HTMLInputElement>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState<string>('');
    const [deliveryTime, setDeliveryTime] = useState<string>('');

    const router = useRouter();

    type NotificationType = 'error';

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: 'Something went wrong',
            description: 'Please check the form and try again.',
            showProgress: true,
            pauseOnHover: true,
        });
    };

    const onTimeChange: TimePickerProps['onChange'] = (time, timeString) => {
        if (Array.isArray(timeString)) {
            setDeliveryTime(timeString[0]);
        } else {
            setDeliveryTime(timeString);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBxmylansmcHoGl-dJuk_C3mHkyqKBBThc&libraries=places`;
        script.async = true;
        script.onload = () => {
            if (typeof google !== 'undefined' && inputRef.current) {
                const options = {
                    componentRestrictions: { country: 'ph' }
                };

                const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        setCoordinates({ lat, lng });

                        const address = place.formatted_address;
                        if (address) {
                            setDeliveryAddress(address);
                        }
                    }
                });
            }
        };
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch(`/api/transactions/view?transactionId=${params.deliveryId}`, {
                method: 'POST',
            });
            const data = await res.json();
            setTransactionData(data);
        };
        fetchEngineData();
    }, [params.deliveryId]);

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch('/api/delivery/availabledrivers', {
                method: 'POST'
            });
            const data = await res.json();
            setDeliveryUser(data.map((delivery: { username: string; }) => ({ label: delivery.username, value: delivery.username })));
        };

        fetchEngineData();
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: '',
            deliveryUser: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setLoading(true);
        const response = await fetch(`/api/delivery/forms?transactionId=${params.deliveryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: deliveryAddress,
                deliveryUser: values.deliveryUser,
                deliveryTime: deliveryTime,
                latloc: coordinates?.lat,
                longloc: coordinates?.lng
            }),
        });

        const data = await response.json();

        if (response.ok && coordinates) {
            router.push(`/deliverytracking/delivery/${params.deliveryId}`);
        } else {
            console.log('Something went wrong.');
            setLoading(false);
            openNotificationWithIcon('error');
        }
    };

    const formatCurrency = (amount: number) => {
        const formatter = new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formatter.format(amount);
    };

    const formatDate = (date: string) => {
        return moment(date).format('MMMM D, YYYY');
    };

    const utcDate = new Date();
    const timeZone = 'Asia/Manila';

    const dateToday = moment.tz(utcDate, timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const formatTransactionTime = (dateTime: string) => {
        const now = moment.tz(dateToday, timeZone);
        const transactionTime = moment.tz(dateTime, timeZone);
        const diffMinutes = now.diff(transactionTime, 'minutes');
        const diffHours = now.diff(transactionTime, 'hours');
        const diffDays = now.diff(transactionTime, 'days');

        if (diffMinutes < 1) {
            return 'just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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
                    components: {
                        Form: {
                            itemMarginBottom: 10,
                            inlineItemMarginBottom: 10,
                            colorText: 'dark:text-gray-900',
                            labelColor: 'dark:text-gray-900',
                            marginLG: 4,
                        }
                    }
                }}
            >
            {contextHolder}
                <div className="pt-24 pb-16 md:pb-0">
                    <div className='items-center mx-auto flex flex-col'>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-center text-xl md:text-3xl font-bold font-sans text-red-950">
                                <span className="bg-highlight bg-no-repeat bg-left-top bg-contain pt-6">Delivery Details</span>
                            </h3>
                            <Form
                                className='flex flex-col md:flex-row mx-auto w-full md:w-[55rem] gap-4 px-2'
                                onFinish={onSubmit}
                                autoComplete="off"
                                requiredMark={false}
                                wrapperCol={{ span: 16 }}
                                layout='inline'
                            >

                                <Grid>
                                    <h3 className='text-red-900 font-bold text-lg font-sans pb-4'>Transaction Information</h3>
                                    <div className="justify-between flex">
                                    <div>
                                    <h1 className="font-sans text-lg font-semibold">
                                        <span className="text-slate-700 dark:text-slate-200">Transaction ID:</span> <span className="text-red-primary">{params.deliveryId}</span>
                                    </h1>
                                    {transactionData && (
                                <>
                                    <div className="grid grid-cols-2 pt-2">
                                        <div className='space-y-2 pr-3'>
                                            <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Payment Method: </span> {transactionData.paymentMethod} </h3>
                                            <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Total Sales: </span> {formatCurrency(transactionData.totalPrice)} </h3>
                                            <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Transaction Date: </span> {formatDate(transactionData.deliveryDate)} </h3>
                                        </div>
                                        <div className='space-y-2'>
                                            <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Transaction Status: </span> Done </h3>
                                            <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Transaction Type: </span> {transactionData.delivery ? "Delivery" : "Warehouse"} </h3>
                                            <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Transaction Created: </span> {formatTransactionTime(transactionData.createAt)} </h3>
                                        </div>
                                    </div>
                                </>
                            )}
                                    </div>
                                    <div className="relative w-28 h-auto justify-center">
                                    <h3 className="font-sans text-md font-semibold"> Engines: </h3>
                                    <Carousel autoplay dots={{ className: "custom-dots1" }} className='text-center h-44'>
                                            {transactionData?.pictures.map((picture, index) => (
                                                <div key={index} className='rounded-xl flex flex-col justify-center items-center'>
                                                    <Badge.Ribbon text={transactionData.engineName[index]} color="#BB4747" placement='start' className='ml-1'>
                                                        <div className="image-container">
                                                            <Image
                                                                src={picture}
                                                                alt={`Engine Image ${index}`}
                                                                width={110}
                                                                height={110}
                                                                className="rounded-xl"
                                                            />
                                                        </div>
                                                    </Badge.Ribbon>
                                                    <span className="text-red-900 text-md font-sans font-bold">{transactionData.quantity[index]} pcs.</span>
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    </div>
                                    <h3 className='text-red-900 font-bold text-lg font-sans pb-4'>Delivery Information</h3>
                                    <Form.Item label="Select Courier" name="deliveryUser" rules={[{ required: true, message: 'Please select a delivery user!' }]}>
                                        <Select
                                            options={deliveryUser}
                                            placeholder="Select a delivery user"
                                            onChange={(value) => form.setValue('deliveryUser', value)}
                                        />
                                    </Form.Item>
                                    <label> Delivery Address: </label>
                                    <input
                                        className='w-[32rem] h-6 border-solid border-1 mb-5 border-gray-300 rounded-lg p-4'
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Enter your address"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        required
                                    />
                                    <Form.Item label="Delivery Time" name="deliveryTime" rules={[{ required: true, message: 'Please select a delivery time!' }]}>
                                        <TimePicker use12Hours format="h:mm a" onChange={onTimeChange} />
                                    </Form.Item>
                                    <div className='flex justify-end'>
                                      <EngineButton>
                                        {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Proceed'} 
                                      </EngineButton>
                                    </div>
                                </Grid>
                            </Form>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </>
    );
}
