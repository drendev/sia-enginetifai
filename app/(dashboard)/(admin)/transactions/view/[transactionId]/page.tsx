"use client";

import { useEffect, useState, createContext } from 'react';
import { Badge, Carousel, Image, Form, Modal, Button, ConfigProvider } from 'antd';
import moment from 'moment-timezone';
import { useRouter } from "next/navigation";

const ReachableContext = createContext<string | null>(null);

interface DeliveryInformation {
    deliveryUser: string;
    deliverStatus: string;
    deliveryDate: string;
    deliveryTime: string;
    address: string;
    city: string;
}

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
    deliveryInformation: DeliveryInformation;
    pictures: string[];
}

export default function Page({ params }: { params: { transactionId: string } }) {
    const router = useRouter();
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    const [modal, contextHolder] = Modal.useModal();
    const [isDeleted, setIsDeleted] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchEngineData = async () => {
            const res = await fetch(`/api/transactions/view?transactionId=${params.transactionId}`, {
                method: 'POST',
            });
            const data = await res.json();
            setTransactionData(data);
        };
        fetchEngineData();
    }, [params.transactionId]);

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

    const handleOnSubmit = async () => {
        const response = await fetch('/api/transactions/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId: params.transactionId,
          }),
        });
    
        if (response.ok) {
          setIsDeleted(true);
          router.push('/transactions');
        } else {
          setLoading(false);
          console.log('Something went wrong.');
        }
      };
    
      if (isDeleted) {
        return null;
      }

      const config = {
        title: "Delete this Transaction?",
        content: (
          <>
            <ReachableContext.Consumer>
              {(name) => `Are you sure you want to permanently delete this transaction?`}
            </ReachableContext.Consumer>
            <br />
          </>
        ),
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
                <div className='items-center mx-auto flex flex-col'>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-between w-full md:w-[50rem] h-auto rounded-2xl shadow-xl bg-enginebackground bg-right-bottom bg-contain bg-no-repeat bg-red-primary px-7 py-5 gap-2">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-red-100 text-4xl font-sans font-extrabold"> View Transaction </h1>
                                <h3 className="text-red-100 text-xl font-sans font-bold pt-5"> Transaction ID: {params.transactionId} </h3>
                                {transactionData && (
                                    <>
                                        <h3 className="text-red-100 text-xl font-sans font-bold"> by: {transactionData.transactionUser} </h3>
                                    </>
                                )}
                                <Form
                                onFinish={async () => {
                                    modal.confirm({
                                    ...config,
                                    onOk: handleOnSubmit,
                                    okText: 'Confirm Delete',
                                    okType: 'danger',
                                    });
                                }}
                                >
                                <ReachableContext.Provider value="Light">
                                    <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-red-primary/90 hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                                    >
                                    Delete Transaction
                                    </Button>
                                    {contextHolder}
                                </ReachableContext.Provider>
                                </Form>
                            </div>
                            <div className='pr-6'>
                                <div className="relative w-28 h-auto justify-center">
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
                                                <span className="text-red-100 text-md font-sans font-bold">{transactionData.quantity[index]} pcs.</span>
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-48 w-full rounded-xl p-4">
                            <h1 className='text-red-900 dark:text-red-100 font-sans font-bold text-xl pb-2'>Transaction Details</h1>
                            {transactionData && (
                                <>
                                    <div className="grid grid-cols-2 pt-2">
                                        <div className='space-y-2'>
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
                        <div className="bg-white dark:bg-slate-900 shadow-md h-auto md:h-48 w-full rounded-xl p-4">
                            <h1 className='text-red-900 dark:text-red-100 font-sans font-bold text-xl pb-2'>Delivery Details</h1>
                            {transactionData ? (
                                transactionData.delivery ? (
                                    transactionData.deliveryInformation && (
                                        <div className="grid grid-cols-2 pt-2">
                                            <div className='space-y-2'>
                                                <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Delivery Status: </span> {transactionData.deliveryInformation.deliverStatus} </h3>
                                                <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Delivery Date: </span> {formatDate(transactionData.deliveryDate)} </h3>
                                                <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Delivery Time: </span> {transactionData.deliveryInformation.deliveryTime} </h3>
                                            </div>
                                            <div className='space-y-2'>
                                                <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Delivery Address: </span> {transactionData.deliveryInformation.address} </h3>
                                                <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Delivery City: </span> {transactionData.deliveryInformation.city} </h3>
                                                <h3 className="text-slate-700 dark:text-slate-200 text-md font-sans"> <span className='font-bold'> Delivery Courier: </span> {transactionData.deliveryInformation.deliveryUser} </h3>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <p className="text-slate-700 dark:text-slate-200 text-md font-sans text-center pt-10">No Delivery Details Available</p>
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            </ConfigProvider>
        </>
    );
}
