"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Carousel, Image, Badge, Timeline, Button, Modal, ConfigProvider } from "antd";
import { CheckOutlined, ClockCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useSession } from "next-auth/react";

interface PackageProps {
  transactionId: number;
}

interface DeliveryInformation {
  deliveryUser: string;
  deliveryTime: string;
  address: string;
  pictures: string[];
  paymentMethod: string;
  totalPrice: number;
  deliveryDate: string;
  createAt: string;
  quantity: number[];
  engineName: string[];
  deliveryStatus: string; // New status field
}

interface TransactionHistoryProps {
  transactionId: number;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount: number) => {
  return `₱${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const PackageInformationCard: React.FC<PackageProps> = ({ transactionId }) => {
  const [transactionData, setTransactionData] = useState<DeliveryInformation | null>(null);

  const { data: session } = useSession();
  const currentUser = session?.user?.username;

  useEffect(() => {
    const fetchTransactionData = async () => {
      const res = await fetch(`/api/delivery/delivarydetails?transactionId=${transactionId}`, {
        method: "POST",
      });
      const data = await res.json();
      setTransactionData(data);
    };
    fetchTransactionData();
  }, [transactionId]);

  return (
    <div className="dark:bg-gray-900 bg-white rounded-lg p-4 shadow-md mb-4 w-full dark:text-black-500">
      <div className="mb-2">
        <h1 className="text-base text-black-600 dark:text-white">Delivery Details</h1>
        <p className="text-xl font-bold mb-2">Transaction ID: {transactionId}</p>
        <hr className="my-2 border-red-600 dark:border-gray-700" />
        <div className="flex flex-wrap justify-between">
          <div className="w-full mb-4 flex">
            <div className="w-1/2">
              <p className="font-semibold">Engines</p>
              <div className="relative w-28 h-auto justify-center">
                <Carousel autoplay dots={{ className: "custom-dots2" }} className="text-center h-40">
                  {transactionData?.pictures.map((picture, index) => (
                    <div key={index} className="rounded-xl flex flex-col justify-center items-center">
                      <Badge.Ribbon
                        text={transactionData.engineName[index]}
                        color="#BB4747"
                        placement="start"
                        className="ml-1"
                      >
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
                      <span className="text-red-950 text-md font-sans font-bold">{transactionData.quantity[index]} pcs.</span>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            <div className="w-1/2">
              <p className="font-semibold">Delivery Location</p>
              <p>{transactionData?.address}</p>
            </div>
          </div>
        </div>

        <hr className="my-2 border-red-600 dark:border-gray-700" />

        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-[30%] mb-4">
            <p className="font-semibold">Total Sales</p>
            <p>{transactionData ? formatCurrency(transactionData.totalPrice) : ""}</p>
          </div>
          <div className="w-full md:w-[30%] mb-4">
            <p className="font-semibold">Payment</p>
            <p>{transactionData?.paymentMethod}</p>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <FaUser className="text-gray-500 dark:text-gray-300 mr-2 ml-2" />
          <p>{transactionData?.deliveryUser}</p>
        </div>
      </div>
    </div>
  );
};

export const TransactionHistoryCard: React.FC<TransactionHistoryProps> = ({ transactionId }) => {
  const [transactionData, setTransactionData] = useState<DeliveryInformation | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: session } = useSession();
  const currentUser = session?.user?.username;

  useEffect(() => {
    const fetchTransactionData = async () => {
      const res = await fetch(`/api/delivery/delivarydetails?transactionId=${transactionId}`, {
        method: "POST",
      });
      const data = await res.json();
      setTransactionData(data);
    };

    fetchTransactionData();

    const intervalId = setInterval(() => {
      fetchTransactionData();
    }, 1000); // Fetch every 5 seconds

    // Clear interval when status is "active" or "done"
    if (transactionData?.deliveryStatus === "done") {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [transactionId, transactionData?.deliveryStatus]);

  const updateDeliveryStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/delivery/updatedelivery?transactionId=${transactionId}&status=${status}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedData = await response.json();
        setTransactionData(updatedData);
        setIsModalVisible(false);
      } else {
        console.error('Failed to update delivery status');
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
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
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 shadow-md mb-4 w-full h-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-black-200 dark:text-white p-1">Delivery Tracking</p>
              <h1 className="text-sm text-gray-500 dark:text-white pl-1">Real-Time Delivery Process</h1>
            </div>
            {currentUser === transactionData?.deliveryUser && transactionData?.deliveryStatus !== "done" && (
              <Button 
                type="primary" 
                onClick={showModal}
                className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full text-md h-auto py-2 px-3 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
              >
                Handle Delivery
              </Button>
            )}
          </div>
          <hr className="my-2 border-red-700 dark:border-gray-700" />
          <div className="pl-8 font-sans font-semibold">
            {transactionData?.deliveryStatus === "active" ? (
              <Timeline
                pending="Delivery on the way"
                reverse={false}
                items={[
                  {
                    children: `Created Transaction`,
                    color: "#BB4747",
                  },
                  {
                    children: "Delivery Details Confirmed",
                    color: "#BB4747",
                  },
                  {
                    dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                    children: `Delivery Scheduled on ${formatDate(transactionData.deliveryDate)}, ${transactionData.deliveryTime}`,
                    color: "#BB4747",
                  },
                  {
                    color: "#facc15",
                    children: "Pending Delivery",
                  },
                ]}
              />
            ) : transactionData?.deliveryStatus === "pending" ? (
              <Timeline
                reverse={false}
                items={[
                  {
                    children: `Created Transaction`,
                    color: "#BB4747",
                  },
                  {
                    children: "Delivery Details Confirmed",
                    color: "#BB4747",
                  },
                  {
                    dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                    children: `Delivery Scheduled on ${formatDate(transactionData.deliveryDate)}, ${transactionData.deliveryTime}`,
                    color: "#BB4747",
                  },
                  {
                    color: "#facc15",
                    children: "Pending Delivery",
                  },
                ]}
              />
            ) : 
            transactionData?.deliveryStatus === "done" ? (
              <Timeline
                reverse={false}
                items={[
                  {
                    children: `Created Transaction`,
                    color: "#BB4747",
                  },
                  {
                    children: "Delivery Details Confirmed",
                    color: "#BB4747",
                  },
                  {
                    dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                    children: `Delivery Scheduled on ${formatDate(transactionData.deliveryDate)}, ${transactionData.deliveryTime}`,
                    color: "#BB4747",
                  },
                  {
                    color: "#BB4747",
                    children: "Pending Delivery",
                  },
                  {
                    dot: <CheckOutlined style={{ fontSize: "16px" }} />,
                    color: "green",
                    children: "Delivered Successfully",
                  },
                ]}
              />
            ) 
            : 
            transactionData?.deliveryStatus === "cancelled" ? (
              <Timeline
                reverse={false}
                items={[
                  {
                    children: `Created Transaction`,
                    color: "#BB4747",
                  },
                  {
                    children: "Delivery Details Confirmed",
                    color: "#BB4747",
                  },
                  {
                    dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                    children: `Delivery Scheduled on ${formatDate(transactionData.deliveryDate)}, ${transactionData.deliveryTime}`,
                    color: "#BB4747",
                  },
                  {
                    color: "#BB4747",
                    children: "Pending Delivery",
                  },
                  {
                    dot: <CloseCircleFilled style={{ fontSize: "16px" }} />,
                    color: "red",
                    children: "Delivery Cancelled",
                  },
                ]}
              />
            ) : null}
          </div>
          <Modal title="Handle Delivery" open={isModalVisible} onCancel={handleCancel} footer={null}>
            <div className="md:flex justify-center items-center">
              {transactionData?.deliveryStatus !== "active" && (
                <Button 
                  type="primary"
                  onClick={() => updateDeliveryStatus("active")}
                  className='bg-red-primary hover:bg-red-primary font-bold rounded-full text-md h-auto py-2 px-3 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                >
                  Start Delivery
                </Button>
              )}
              {transactionData?.deliveryStatus === "active" && (
                <Button 
                  type="primary" 
                  onClick={() => updateDeliveryStatus("done")}
                  className='bg-red-primary ml-3 hover:bg-red-primary font-bold rounded-full text-md h-auto py-2 px-3 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                >
                  Mark as Done
                </Button>
              )}
              <Button 
                type="primary" 
                onClick={() => updateDeliveryStatus("cancelled")}
                className='bg-red-primary ml-3 hover:bg-red-primary font-bold rounded-full text-md h-auto py-2 px-3 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
              >
                Cancel Delivery
              </Button>
            </div>
          </Modal>
        </div>
      </ConfigProvider>
    </>
  );  
};

export default TransactionHistoryCard;
