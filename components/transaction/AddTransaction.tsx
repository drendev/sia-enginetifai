"use client"

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, DatePicker, InputNumber, Select, ConfigProvider, Switch, Badge, List, Avatar, Drawer, Image, Spin,  } from 'antd';
import dayjs from 'dayjs';
import EngineButton from '../ui/index/button';
import Grid from '../ui/engineforms/FormGrid';
import type { RadioChangeEvent } from 'antd';
import { BankOutlined, CreditCardFilled, LoadingOutlined } from '@ant-design/icons';

const FormSchema = z.object({
    transactionUser: z.string().min(5, 'Username Max Limit.').max(30),
    engineName: z.string().min(5, 'Engine Max Limit.').max(30),
    quantity: z.any(),
    delivery: z.boolean(),
    deliveryDate: z.date().min(dayjs().startOf('day').toDate(), { message: 'Delivery Date is required' }),
    transactionMethod: z.string().min(5, 'Transaction Not Valid').max(30),
  });

interface Engine {  
  price: number[],
  quantity: number[],
  picture: string[],
  description: string[],
  engineType: string[],
  engineName: string[]
}

interface TransactionId {
  id: number;
}

const AddTransaction = () => {
  const [engineName, setEngineName] = useState<string[]>([]);
  const [engine, setEngine] = useState<Engine[]>([]);
  const [calcQuantity, setCalcQuantity] = useState<number[]>([]);
  const [engineData, setEngineData] = useState([]);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user.username;
  const [selectedMethod, setSelectedMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<TransactionId | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!engineName) return setEngineName([]);

      const queryString = engineName.map(name => `engineName=${name}`).join('&');
      const res = await fetch(`/api/enginelist?${queryString}`, {
        method: 'POST',
      });

      const data = await res.json() as Engine[];
      setEngine(data);
      setCalcQuantity(new Array(data.length).fill(1)); // Set default quantity to 1 for each engine
    };

    fetchData();
  }, [engineName]);

  useEffect(() => {
    const fetchEngineData = async () => {
      const res = await fetch('/api/findengine', {
        method: 'POST'
      });
      const data = await res.json();
      JSON.stringify(data);
      setEngineData(data.map((item: { engineName: any; }) => item.engineName));
    };

    fetchEngineData();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {  
      transactionUser: '',
      engineName: '',
      quantity: 1,
      delivery: false,
      transactionMethod: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const formattedDate = dayjs(values.deliveryDate).format('YYYY-MM-DD');
    setLoading(true);
    const transactions = engineName.map((engineName, index) => ({
      engineName,
      quantity: calcQuantity[index],
    }));

    const responseStock = await fetch('/api/enginetransacted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions
      }),
    });

    const response = await fetch('/api/addtransac', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionUser: user,
        engineNames: transactions.map((transaction) => transaction.engineName),
        quantity: transactions.map((transaction) => transaction.quantity),
        delivery: values.delivery,
        deliveryDate: formattedDate,
        paymentMethod: selectedMethod,
      }),
    });

    const data = await response.json();

    if (responseStock.ok && response.ok) {
      setTransactionId(data.id)
      if(values.delivery == true) {
      router.push(`/deliverytracking/forms/${data.id}`);
      } else {
      router.push(`/transactions`);
      }
    } else {
      console.log('Something went wrong.');
      setLoading(false);
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newQuantities = [...calcQuantity];
    newQuantities[index] = value;
    setCalcQuantity(newQuantities);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSelect = (method: any) => {
    setSelectedMethod(method);
  };

  const formatCurrency = (value: any) => `₱${new Intl.NumberFormat('en-PH', { minimumFractionDigits: 0 }).format(value)}`;

  const calculateTotal = () => {
    return engine.reduce((total, engine, index) => total + (calcQuantity[index] * Number(engine.price)), 0);
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
        <div className="pt-8 pb-16 md:pb-0">
          <div className='items-center mx-auto flex flex-col'>
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-xl md:text-3xl font-bold font-sans text-red-950"> <span className="bg-highlight bg-no-repeat bg-left-top bg-contain pt-6">Add Transaction</span> </h3>
              <Form
                className='flex flex-col md:flex-row mx-auto w-full md:w-[55rem] gap-4 px-2'
                onFinish={onSubmit}
                autoComplete="off"
                requiredMark={false}
                wrapperCol={{ span: 16 }}
                layout='inline'
              >

                <Grid>
                  <h3 className='text-red-900 font-bold text-lg font-sans pb-4'> Select Engine </h3>
                  <Form.Item
                    className='text-slate-800 dark:text-slate-400 pb-5'
                    label="Engine Name"
                    name="engineName"
                    rules={[
                      { required: true, message: "Please select engine" },
                    ]}
                  >
                    <Select
                      mode='multiple'
                      maxCount={10}
                      options={engineData.map((option) => ({ value: option }))}
                      value={engineName}
                      onChange={(value) => setEngineName(value)}
                    />
                  </Form.Item>
                  <div className='items-center justify-center flex'>
                  <Badge count={engine.length} showZero>
                    <List
                      className='w-96 border-red-primary/50 hover:border-red-primary/20 cursor-pointer mb-5'
                      dataSource={[
                        {
                          id: 1,
                          name: 'Aldren',
                        },
                      ]}
                      bordered
                      renderItem={(item) => (
                        <List.Item
                          key={item.id}
                          onClick={showDrawer}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar shape='square' src="/cart.svg" />
                            }
                            title={'Transaction Cart'}
                            description="View available stock and edit quantity"
                          />
                        </List.Item>
                      )}
                    />
                    </Badge>
                  </div>
                  <Drawer width={540} placement="right" closable={true} onClose={onClose} open={open}>
                    <List
                      itemLayout="horizontal"
                      dataSource={engine}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Image src={typeof item.picture === 'string' ? item.picture : item.picture[0]} width={120} height={120} className='rounded-lg' />}
                            title={<span>{item.engineName}</span>}
                            description={
                              <>
                                <div>{item.engineType}</div>
                                <div>Available Stock: {item.quantity}</div>
                                <div>Price: {formatCurrency(item.price)}</div>
                              </>
                            }
                          />
                          <div className="flex w-32">
                            <Form.Item
                              initialValue={1}
                              className='text-slate-800 dark:text-slate-400'
                              name={`quantity_${index}`}
                              label="Quantity"
                              key={index}
                              rules={[{ required: true, message: 'Please input quantity' },
                                () => ({
                                  validator(_, value) {
                                    if (value % 1 !== 0 && value > 0) {
                                      return Promise.reject('');
                                    }
                                    if (engine && value > item.quantity) {
                                      return Promise.reject('Not enough stock');
                                    }
                                    return Promise.resolve();
                                  },
                                })
                              ]}
                            >
                              <InputNumber
                                className='w-14'
                                min={1}
                                value={calcQuantity[index]}
                                onChange={value => handleQuantityChange(index, value || 1)}
                              />
                            </Form.Item>
                          </div>
                        </List.Item>
                      )}
                    />
                    <div style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', marginTop: 'auto' }}>
                      <Form.Item label="Total Transaction: ">
                        <p>{formatCurrency(calculateTotal())}</p>
                      </Form.Item>
                    </div>
                  </Drawer>

                  <h3 className='text-red-900 font-bold text-lg font-sans pb-2'> Transaction Information </h3>
                  <div className="max-w-md mx-auto pb-4">
                    <div className="flex space-x-4">
                      <div
                        className={`flex-1 p-4 border rounded-lg text-center cursor-pointer ${
                          selectedMethod === 'Cash On Delivery' ? 'bg-red-primary/10 border-red-primary text-red-primary' : 'hover:bg-red-primary/5 text-slate-500'
                        }`}
                        onClick={() => handleSelect('Cash On Delivery')}
                      >
                        <CreditCardFilled className='text-2xl'/>
                        <span className="mt-2 block">Cash On Delivery</span>
                      </div>
                      <div
                        className={`flex-1 p-4 border rounded-lg text-center cursor-pointer ${
                          selectedMethod === 'Paid in Warehouse' ? 'bg-red-primary/10 border-red-primary text-red-primary' : 'hover:bg-red-primary/5 text-slate-500'
                        }`}
                        onClick={() => handleSelect('Paid in Warehouse')}
                      >
                        <BankOutlined className='text-2xl'/>
                        <span className="mt-2 block">Paid in Warehouse</span>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <Form.Item
                      className='text-slate-800 dark:text-slate-400'
                      label="Transaction Date"
                      name="deliveryDate"
                      rules={[{ required: true, message: 'Please select the delivery date!' }]}
                      initialValue={dayjs()}
                    >
                      <DatePicker 
                        format={'DD/MM/YYYY'}
                        onChange={(date) => form.setValue('deliveryDate', date.toDate())}
                      />
                    </Form.Item>

                    <Form.Item
                      className='text-slate-800 dark:text-slate-400'
                      label="Delivery"
                      name="delivery"
                      initialValue={false}
                    >
                      <Switch
                        className='shadow-inner bg-slate-200'
                      />
                    </Form.Item>
                  </div>
                  
                  <p className='text-red-950 text-lg font-sans font-bold pt-5'>Transaction Total: {formatCurrency(calculateTotal())}</p>
                  <div className='flex justify-end'>
                      <EngineButton>
                        {loading ? <Spin indicator={<LoadingOutlined className="text-white" spin />} /> : 'Add Transaction'} 
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
};

export default AddTransaction;
