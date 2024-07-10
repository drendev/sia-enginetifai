"use client";

import Link from "next/link";
import { Button, ConfigProvider, Image, Form, Modal, Row, Col, Card } from "antd";
import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment-timezone';

const ReachableContext = createContext<string | null>(null);

interface Engine {
  userName: string;
  engineName: string;
  engineType: string;
  price: number;
  quantity: string;
  picture: string;
  description: string;
}

interface Transaction {
  id: number;
  quantity: number;
  totalPrice: number;
  createAt: string;
}

interface EngineSpecification {
  [key: string]: string | undefined;  // Generalizing the property values as string or undefined
  // Define specific properties if necessary
}

export default function EnginePageGrid({
  params,
}: {
  params: { engineId: string };
}) {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const [engineData, setEngineData] = useState<Engine | null>(null);
  const [engineSpecification, setEngineSpecification] = useState<EngineSpecification | null>(null);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  /* Fetch Engine data */
  useEffect(() => {
    if (isDeleted) return;

    const fetchEngineData = async () => {
      const res = await fetch(`/api/engines/engineId?engineId=${params.engineId}`, {
        method: 'POST',
      });
      const data = await res.json();
      setEngineData(data);
    };
    fetchEngineData();
  }, [params.engineId, isDeleted]);

  /* Fetch Transaction data */
  useEffect(() => {

    const fetchTransactionData = async () => {
      const res = await fetch(`/api/engines/enginepagetransac?engineId=${params.engineId}`, {
        method: 'POST',
      });
      const data = (await res.json()) as Transaction[];
      setTransactionData(data);
    };
    fetchTransactionData();
  }, [params.engineId]);

  /* Fetch Specification Data */
  useEffect(() => {

    const fetchEngineSpecification = async () => {
      const res = await fetch(`/api/engines/specification?engineId=${params.engineId}`, {
        method: 'POST',
      });
      const data = await res.json();
      setEngineSpecification(data);
    };
    fetchEngineSpecification();
  }, [params.engineId]);

  useEffect(() => {

    const fetchTransactionData = async () => {
      const res = await fetch(`/api/engines/enginepagetransac?engineId=${params.engineId}`, {
        method: 'POST',
      });
      const data = (await res.json()) as Transaction[];
      setTransactionData(data);
    };
    fetchTransactionData();
  }, [params.engineId]);  useEffect(() => {

    const fetchTransactionData = async () => {
      const res = await fetch(`/api/engines/enginepagetransac?engineId=${params.engineId}`, {
        method: 'POST',
      });
      const data = (await res.json()) as Transaction[];
      setTransactionData(data);
    };
    fetchTransactionData();
  }, [params.engineId]);
  const sortedData = [...transactionData].sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());

  /* format time and date */
  const utcDate = new Date();
  const timeZone = 'Asia/Manila';
  const dateToday = moment.tz(utcDate, timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

  const formatTransactionTime = (dateTime: string) => {
    const now = moment.tz(dateToday, timeZone);  // Use dateToday instead of the current moment
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
// Render each specification
const renderSpecifications = (specifications: EngineSpecification | null) => {
  if (!specifications) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(specifications).map(([key, value]) => {
        if (value) {
          return (
            <div key={key} className="p-2">
              <span className="font-semibold">{key}:</span> <span className="text-red-950 font-sans font-bold">{value}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const handleAddButtonClick = () => {

  setShowAddForm(true); 
};
  const handleOnSubmit = async () => {
    const response = await fetch('/api/engines/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        engineName: engineData?.engineName,
      }),
    });

    if (response.ok) {
      setIsDeleted(true);
      router.push('/engines');
    } else {
      console.log('Something went wrong.');
    }
  };

  if (isDeleted) {
    return null;
  }

  const config = {
    title: `Delete ${engineData?.engineName}`,
    content: (
      <>
        <ReachableContext.Consumer>
          {(name) => `Are you sure you want to permanently delete this engine?`}
        </ReachableContext.Consumer>
        <br />
      </>
    ),
  };

  return (
    <>
      <div className="h-full bg-red-primary/5 pt-10 pb-10 md:pb-0 md:pt-16">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#BB4747',
              colorLink: '#BB4747',
              colorText: '#BB4747',
              colorBorder: '#BB4747',
              colorPrimaryBg: '#BB4747',
            },
          }}
        >
          <div className="h-full flex-col flex md:px-10">
            <div className="flex flex-col sm:flex-row md:gap-2">
              <div className="flex-col md:flex-grow p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center justify-between w-full h-52 rounded-2xl shadow-xl bg-enginebackground bg-right-bottom bg-contain bg-no-repeat bg-red-primary px-7 py-5 gap-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-red-100 text-4xl font-sans font-extrabold">
                        {engineData?.engineName}
                      </h1>
                      <h1 className="text-red-100 text-xl font-sans font-extrabold">
                        Type: {engineData?.engineType}
                      </h1>
                      <h1 className="text-red-100 text-md font-sans font-semibold">
                        Available stocks: {engineData?.quantity}
                      </h1>
                      <h1 className="text-red-100 text-md font-sans font-semibold">
                        Price: {engineData?.price}
                      </h1>
                    </div>
                    <div className="pr-6">
                      <Image
                        src={`${engineData?.picture}`}
                        alt="AI"
                        width={170}
                        height={170}
                        className="self-center rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-6 mt-4">
                    <Button
                      onClick={handleAddButtonClick}
                      type="primary"
                      htmlType="submit"
                      className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                    >
                      Edit Engine
                    </Button>
                    <Button
                      onClick={handleAddButtonClick}
                      type="primary"
                      htmlType="submit"
                      className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                    >
                      Edit Specification
                    </Button>
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
                          Delete Engine
                        </Button>
                        {contextHolder}
                      </ReachableContext.Provider>
                    </Form>
                  </div>

                  {/* Specification */}
                  <div className="w-full 2xl:w-full h-full md:h-80 bg-white shadow-md rounded-xl p-4">
                    <div className="text-red-900 text-2xl font-sans font-extrabold space-y-2">
                      Specifications
                    </div>
                    {engineSpecification && renderSpecifications(engineSpecification)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                <div className="relative md:fixed pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
                
                {/* Description */}
                <div className="w-full md:w-[29rem] h-64 bg-white shadow-md rounded-xl p-4 flex flex-col">
                  <div className="text-red-900 text-2xl font-sans font-extrabold space-y-2">
                    Description
                  </div>
                  <p className="break-words py-4 flex-1">
                    {engineData?.description}
                  </p>
                  <h3 className="text-wrap py-4 text-red-900 font-sans font-semibold ">
                    Added by: {engineData?.userName}
                  </h3>
                </div>

                {/* Recent Transaction */}
                <div className="text-2xl font-bold font-sans mb-7 my-5">
                <span className="bg-fireworks bg-no-repeat bg-right-bottom bg-contain pb-4 text-red-900"> Recently Transacted </span>
                </div>
                <div className="text-md">
                <div className="w-full">
                    <div className="bg-red-primary/15 flex font-bold">
                        <div className="text-left p-4 flex-1">Quantity</div>
                        <div className="text-left p-4 flex-1">Total Sales</div>
                        <div className="text-left p-4 flex-1">Time</div>
                    </div>
                    <div className="divide-y">
                      
                    {sortedData.length > 0 ? (
                      <div className="divide-y">
                        {sortedData.map((item, index) => (
                          <div key={index} className="flex hover:bg-red-primary/5">
                            <div className="p-4 flex-1">
                              {item.quantity}
                            </div>
                            <div className="p-4 flex-1">
                              {item.totalPrice}
                            </div>
                            <div className="p-4 flex-1">
                              {formatTransactionTime(item.createAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        No transactions found
                      </div>
                    )}
                    </div>
                </div>
            </div>
            {showAddForm && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[60rem]">
                  <h2 className="text-lg font-semibold mb-4">Edit Engine : {engineData?.engineName} </h2>
                  <form>
                    <div className="mb-4">
                      <label className="block mb-1">Engine Name</label>
                      <select
                      
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                        required
                      >
                        <option value="">Select Engine</option>
                        <option value="Engine ABC">Engine ABC</option>
                        <option value="Engine XYZ">Engine XYZ</option>
                        <option value="Engine 123">Engine 123</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Quantity</label>
                      <input
                        type="number"
                        placeholder="Quantity"
                        
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Place</label>
                      <input
                        type="text"
                        placeholder="Place"
                        
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-primary text-white rounded-lg"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
