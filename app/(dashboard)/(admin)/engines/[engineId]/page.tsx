"use client";

import Link from "next/link";
import { Button, ConfigProvider, Image, Form, Modal, Input, Upload, Select, Spin, notification, Badge } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState, createContext, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment-timezone';
import { useSession } from "next-auth/react";

const ReachableContext = createContext<string | null>(null);

interface Engine {
  userName: string;
  engineName: string;
  engineType: string;
  price: number;
  quantity: string;
  picture: string;
  description: string;
  status: boolean;
}

interface Transaction {
  id: number;
  quantity: number;
  totalPrice: number;
  createAt: string;
}

interface EngineSpecification {
  [key: string]: string | undefined;
}

const numericalFields = ["LoadingQty", "MaxACOutput", "NetWeight", "GrossWeight", "Inlet", "MaxCapacity", "IdleSpeed", "Size", "NetPower", "Weight", "EngineSpeed", "FuelConsumption", "LubeOilCapacity"];

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
  const [showEditEngineForm, setShowEditEngineForm] = useState(false);
  const [showEditSpecificationForm, setShowEditSpecificationForm] = useState(false);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [showReduceStockForm, setShowReduceStockForm] = useState(false);
  const [editEngineForm] = Form.useForm();
  const [editSpecificationForm] = Form.useForm();
  const [addStockForm] = Form.useForm();
  const [reduceStockForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const currentUser = session?.user?.username;

  const [api, contextHolderNotification] = notification.useNotification();

  const openNotificationWithIcon = (type: 'success' | 'error', message: string, description: string) => {
    api[type]({
      message: message,
      description: description,
    });
  };

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

  const sortedData = [...transactionData].sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());

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

  const renderSpecifications = (specifications: EngineSpecification | null) => {
    if (!specifications) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        {Object.entries(specifications).map(([key, value]) => {
          if (value) {
            return (
              <div key={key} className="p-2">
                <span className="font-semibold">{key}:</span> <span className="text-red-900 dark:text-red-primary font-sans font-bold">{value}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const handleEditEngineButtonClick = () => {
    setShowEditEngineForm(true);
    if (engineData) {
      editEngineForm.setFieldsValue({
        engineName: engineData.engineName,
        engineType: engineData.engineType,
        price: engineData.price,
        quantity: engineData.quantity,
        description: engineData.description,
      });
    }
  };

  const handleEditSpecificationButtonClick = () => {
    setShowEditSpecificationForm(true);
    if (engineSpecification) {
      const initialValues = Object.fromEntries(
        Object.entries(engineSpecification).filter(([key, value]) => value)
      );
      editSpecificationForm.setFieldsValue(initialValues);
    }
  };

  const handleAddStockButtonClick = () => {
    setShowAddStockForm(true);
  };

  const handleReduceStockButtonClick = () => {
    setShowReduceStockForm(true);
  };

  const handleEditEngineSubmit = async (values: any) => {
    setLoading(true);
    const response = await fetch(`/api/engines/editengine?engineId=${params.engineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        engineName: values.engineName,
        engineType: values.engineType,
        price: values.price,
        description: values.description,
      })
    });

    if (response.ok) {
      setLoading(false);
      setShowEditEngineForm(false);
      const updatedData = await response.json();
      setEngineData(updatedData);
    } else {
      setLoading(false);
      console.log('Something went wrong.');
    }
  };

  const handleEditSpecificationSubmit = async (values: any) => {
    setLoading(true);
    const response = await fetch(`/api/engines/editspecification?engineId=${params.engineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    });
    if (response.ok) {
      setLoading(false);
      setShowEditSpecificationForm(false);
      const updatedData = await response.json();
      setEngineSpecification(updatedData);
    } else {
      setLoading(false);
      console.log('Something went wrong.');
      setLoading(false);
    }
  };

  const handleAddStockSubmit = async (values: any) => {
    if (values.quantity <= 0) {
      openNotificationWithIcon('error', 'Invalid Quantity', 'Quantity cannot be negative or zero.');
      return;
    }
    setLoading(true);
    const response = await fetch(`/api/engines/addstock?engineId=${params.engineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: values.quantity,
      })
    });

    if (response.ok) {
      setLoading(false);
      setShowAddStockForm(false);
      const updatedData = await response.json();
      setEngineData(updatedData);
    } else {
      setLoading(false);
      console.log('Something went wrong.');
    }
  };

  const handleReduceStockSubmit = async (values: any) => {
    if (values.quantity <= 0) {
      openNotificationWithIcon('error', 'Invalid Quantity', 'Quantity cannot be negative or zero.');
      return;
    }
    setLoading(true);
    const response = await fetch(`/api/engines/reducestock?engineId=${params.engineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: values.quantity,
        reason: values.reason,
        engineName: engineData?.engineName,
        user: currentUser,
      })
    });

    if (response.ok) {
      setLoading(false);
      setShowReduceStockForm(false);
      const updatedData = await response.json();
      setEngineData(updatedData);
    } else {
      setLoading(false);
      console.log('Something went wrong.');
    }
  };

  const handleSetActiveStatus = async () => {
    const newStatus = !engineData?.status;
    const response = await fetch('/api/engines/setinactive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        engineId: Number(params.engineId),
        status: newStatus
      }),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setEngineData(updatedData);
      window.location.reload();
    } else {
      setLoading(false);
      console.log('Something went wrong.');
    }
  };

  const filterSpecialCharacters = (value: string) => {
    return value.replace(/[^\w\s]/gi, '');
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFieldValue: (name: string, value: any) => void,
    fieldName: string
  ) => {
    const { value } = e.target;
    setFieldValue(fieldName, filterSpecialCharacters(value));
  };

  if (isDeleted) {
    return null;
  }

  return (
    <>
      <div className="pt-10 pb-10 md:pb-0 md:pt-16">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#BB4747',
              colorLink: '#BB4747',
            },
          }}>
          <div className="h-full flex-col flex md:px-10">
            <div className="flex flex-col sm:flex-row md:gap-2">
              <div className="flex-col md:flex-grow p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center justify-between w-full h-52 rounded-2xl shadow-xl bg-enginebackground bg-right-bottom bg-contain bg-no-repeat bg-red-primary px-7 py-5 gap-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-red-100 text-2xl md:text-4xl font-sans font-extrabold">
                        {engineData?.engineName}
                      </h1>
                      <h1 className="text-red-100 text-md md:text-xl font-sans font-extrabold">
                        Type: {engineData?.engineType}
                      </h1>
                      <h1 className="text-red-100 text-sm md:text-md font-sans font-semibold">
                        Available stocks: {engineData?.quantity}
                      </h1>
                      <h1 className="text-red-100 text-sm md:text-md font-sans font-semibold">
                        Price: {engineData?.price}
                      </h1>
                      <Button
                        onClick={handleAddStockButtonClick}
                        type="primary"
                        htmlType="submit"
                        className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                      >
                        Add Stock
                      </Button>
                    </div>
                    <div className="pr-6">
                      {engineData?.status === false && (
                        <Badge.Ribbon text={'Deactivated'} color="#BB4747" placement='start' className="opacity-80 p-1">
                          <Image
                            src={`${engineData?.picture}`}
                            alt="AI"
                            width={170}
                            height={170}
                            className="self-center rounded-xl"
                          />
                        </Badge.Ribbon>
                      )}
                      {engineData?.status === true && (
                        <Image
                          src={`${engineData?.picture}`}
                          alt="AI"
                          width={170}
                          height={170}
                          className="self-center rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:flex justify-end gap-6 mt-4">
                    <Button
                      onClick={handleEditEngineButtonClick}
                      type="primary"
                      htmlType="submit"
                      className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                    >
                      Edit Engine
                    </Button>
                    <Button
                      onClick={handleEditSpecificationButtonClick}
                      type="primary"
                      htmlType="submit"
                      className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                    >
                      Edit Specification
                    </Button>
                    <Button
                      onClick={handleReduceStockButtonClick}
                      type="primary"
                      htmlType="submit"
                      className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                    >
                      Reduce Stock
                    </Button>
                    <Form
                      onFinish={async () => {
                        modal.confirm({
                          title: `Change Status of ${engineData?.engineName}`,
                          content: (
                            <ReachableContext.Consumer>
                              {(name) => `Are you sure you want to ${engineData?.status ? 'deactivate' : 'activate'} this engine?`}
                            </ReachableContext.Consumer>
                          ),
                          onOk: handleSetActiveStatus,
                          okText: `Confirm ${engineData?.status ? 'Deactivate' : 'Activate'}`,
                          okType: engineData?.status ? 'danger' : 'primary',
                        });
                      }}
                    >
                      <ReachableContext.Provider value="Light">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="bg-red-primary hover:bg-red-primary h-auto font-bold rounded-full w-auto text-md py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
                        >
                          {engineData?.status ? 'Deactivate Engine' : 'Activate Engine'}
                        </Button>
                        {contextHolder}
                      </ReachableContext.Provider>
                    </Form>
                  </div>

                  <div className="w-full 2xl:w-full h-full md:h-[21rem] bg-white dark:bg-slate-900 shadow-md rounded-xl p-4">
                    <div className="text-red-900 text-2xl font-sans font-extrabold space-y-2">
                      Specifications
                    </div>
                    {engineSpecification && renderSpecifications(engineSpecification)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                <div className="relative md:fixed pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">

                  <div className="w-full md:w-[29rem] h-64 bg-white dark:bg-slate-900 shadow-md rounded-xl p-4 flex flex-col">
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

                  <div className="text-2xl font-bold font-sans mb-7 my-5">
                     Recently Transacted
                  </div>
                  <div className="text-sm">
                    <div className="w-full">
                      <div className="bg-red-primary/15 flex font-bold">
                        <div className="text-left p-2 flex-1">Quantity</div>
                        <div className="text-left p-2 flex-1">Total Sales</div>
                        <div className="text-left p-2 flex-1">Time</div>
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
                  {showEditEngineForm && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 overflow-scroll md:overflow-auto">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-16 shadow-lg w-full max-w-4xl">
                        <h2 className="text-lg font-semibold mb-4">Edit Engine : {engineData?.engineName} </h2>
                        <Form autoComplete="off" form={editEngineForm} onFinish={handleEditEngineSubmit}>
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div className="mb-4">
                              <label className="text-slate-600 dark:text-slate-200 block mb-1 font-sans font-semibold">Engine Name</label>
                              <Form.Item className="mb-0" name="engineName" rules={[{ required: true, message: 'Please enter engine name' }]}>
                                <Input
                                  placeholder="Engine Name"
                                  maxLength={15}
                                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                                  required
                                  onChange={(e) => handleInputChange(e, editEngineForm.setFieldValue, 'engineName')}
                                />
                              </Form.Item>
                            </div>
                            <div className="mb-4">
                              <label className="text-slate-600 dark:text-slate-200 block mb-1 font-sans font-semibold">Engine Type</label>
                              <Form.Item className="mb-0" name="engineType" rules={[{ required: true, message: 'Please enter engine type' }]}>
                                <Select
                                  showSearch
                                  placeholder="Search to Select"
                                  optionFilterProp="label"
                                  filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                  }
                                  options={[
                                    { value: 'Diesel Engine', label: 'Diesel Engine' },
                                    { value: 'Twin-Cylinder Diesel Engine', label: 'Twin-Cylinder Diesel Engine' },
                                    { value: 'Open Type Diesel Generator', label: 'Open Type Diesel Generator' },
                                    { value: 'Silent Diesel Generator', label: 'Silent Diesel Generator' },
                                    { value: 'Twin-Cylinder Diesel Generator', label: 'Twin-Cylinder Diesel Generator' },
                                    { value: 'Diesel Water Pump', label: 'Diesel Water Pump' },
                                    { value: 'Diesel High Pressure Pump', label: 'Diesel High Pressure Pump' },
                                    { value: 'Diesel Iron Pump', label: 'Diesel Iron Pump' },
                                    { value: 'Gasoline Engine', label: 'Gasoline Engine' },
                                    { value: 'Gasoline Twin-Cylinder Engine', label: 'Gasoline Twin-Cylinder Engine' },
                                    { value: 'Gasoline Twin-Vertical Engine', label: 'Gasoline Twin-Vertical Engine' },
                                    { value: 'Open Type Gasoline Generator', label: 'Open Type Gasoline Generator' },
                                    { value: 'Silent Gasoline Generator', label: 'Silent Gasoline Generator' },
                                    { value: 'Twin-Cylinder Gasoline Generator', label: 'Twin-Cylinder Gasoline Generator' },
                                    { value: 'Liquified Petroleum Gas & LPT Generator', label: 'Liquified Petroleum Gas & LPT Generator' },
                                    { value: 'Portable Gasoline Generator', label: 'Portable Gasoline Generator' },
                                    { value: 'Gasoline Water Pump', label: 'Gasoline Water Pump' },
                                    { value: 'Gasoline High Pressure Pump', label: 'Gasoline High Pressure Pump' },
                                    { value: 'Gasoline Iron Pump', label: 'Gasoline Iron Pump' },
                                    { value: 'Gasoline Trash Pump', label: 'Gasoline Trash Pump' },
                                    { value: 'Inverter Generator', label: 'Inverter Generator' },
                                    { value: 'Diesel Welding Generator', label: 'Diesel Welding Generator' },
                                    { value: 'Gasoline Welding Generator', label: 'Gasoline Welding Generator' },
                                    { value: 'Tillers', label: 'Tillers' },
                                  ]}
                                />
                              </Form.Item>
                            </div>
                            <div className="mb-4">
                              <label className="text-slate-600 dark:text-slate-200 block mb-1 font-sans font-semibold">Price</label>
                              <Form.Item className="mb-0" name="price" rules={[{ required: true, message: 'Please enter price' }]}>
                                <Input
                                  type="number"
                                  placeholder="Price"
                                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                                  required
                                />
                              </Form.Item>
                            </div>
                            <div className="mb-4">
                              <label className="text-slate-600 dark:text-slate-200 block mb-1 font-sans font-semibold">Description</label>
                              <Form.Item className="mb-0" name="description" rules={[{ required: true, message: 'Please enter description' }]}>
                                <Input.TextArea
                                  placeholder="Description"
                                  maxLength={115}
                                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                                  required
                                  onChange={(e) => handleInputChange(e, editEngineForm.setFieldValue, 'description')}
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                              onClick={() => setShowEditEngineForm(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-red-primary text-white rounded-lg"
                            >
                              {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Edit Engine'}
                            </button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}
                  {showEditSpecificationForm && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 overflow-scroll md:overflow-auto">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-10 md:mt-16 shadow-lg w-full max-w-4xl">
                        <h2 className="text-lg font-semibold mb-4">Edit Specifications</h2>
                        <Form autoComplete="off" form={editSpecificationForm} onFinish={handleEditSpecificationSubmit}>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {engineSpecification && Object.keys(engineSpecification).filter(key => engineSpecification[key]).map((key) => (
                              <div className="mb-4" key={key}>
                                <label className="text-slate-600 dark:text-slate-200 block mb-1 font-sans font-semibold">{key}</label>
                                <Form.Item className="mb-0" name={key} rules={[{ required: true, message: `Please enter ${key}` }]}>
                                  {numericalFields.includes(key) ? (
                                    <Input
                                      type="number"
                                      placeholder={key}
                                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                                      required
                                      max={999}
                                      min={1}
                                    />
                                  ) : (
                                    <Input
                                      placeholder={key}
                                      maxLength={15}
                                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                                      required
                                      onChange={(e) => handleInputChange(e, editSpecificationForm.setFieldValue, key)}
                                    />
                                  )}
                                </Form.Item>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                              onClick={() => setShowEditSpecificationForm(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-red-primary text-white rounded-lg hover:bg-red-primary/80"
                            >
                              {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Edit Specification'}
                            </button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}
                  {showAddStockForm && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 overflow-scroll md:overflow-auto">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg mt-10 md:mt-16 shadow-lg w-72 max-w-4xl">
                        <h2 className="text-lg font-semibold mb-4">Add Stock for {engineData?.engineName}</h2>
                        <Form autoComplete="off" form={addStockForm} onFinish={handleAddStockSubmit}>
                          <div className="mb-4">
                            <Form.Item className="mb-0" name="quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                              <Input
                                type="number"
                                placeholder="Quantity"
                                min={1}
                                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                                required
                              />
                            </Form.Item>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                              onClick={() => setShowAddStockForm(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-red-primary text-white rounded-lg hover:bg-red-primary/80"
                            >
                              {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Add Stock'}
                            </button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}

                  {showReduceStockForm && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 overflow-scroll md:overflow-auto">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg mt-6 md:mt-16 shadow-lg w-72 max-w-4xl">
                        <h2 className="text-lg font-semibold">Reduce Stock for {engineData?.engineName}</h2>
                        <Form autoComplete="off" form={reduceStockForm} onFinish={handleReduceStockSubmit}>
                          <div className="mb-1">
                            <Form.Item className="mb-0" name="quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                              <Input
                                type="number"
                                placeholder="Quantity"
                                min={1}
                                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w/full"
                                required
                              />
                            </Form.Item>
                            <Form.Item className="mb-0" name="reason" rules={[{ required: true, message: 'Please enter reason' }]}>
                              <Input.TextArea
                                placeholder="Reason"
                                maxLength={115}
                                className="p-2 my-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w/full"
                                required
                                onChange={(e) => handleInputChange(e, reduceStockForm.setFieldValue, 'reason')}
                              />
                            </Form.Item>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                              onClick={() => setShowReduceStockForm(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-red-primary text-white rounded-lg hover:bg-red-primary/80"
                            >
                              {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Reduce Stock'}
                            </button>
                          </div>
                        </Form>
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
