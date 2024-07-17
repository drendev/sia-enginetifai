"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Drawer, theme } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Badge, Avatar } from 'antd';
import moment from 'moment-timezone';

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

interface Transactions {
  id: string;
  delivery: string;
  transactionUser: string;
  paymentMethod: string;
  createAt: string;
  user: string;
}

const CalendarTransaction: React.FC = () => {
  const { token } = theme.useToken();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [transactions, setTransactions] = useState([]  as Transactions[]);

  const wrapperStyle: React.CSSProperties = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const onDateSelect = (date: Dayjs) => {
    const currentDate = dayjs();
    if (date.month() !== currentDate.month() && date.date() === currentDate.date()) {
      setDrawerVisible(false);
    } else {
      setSelectedDate(date);
      setDrawerVisible(true);
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      if (selectedDate) {
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        const res = await fetch('/api/transactions/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: formattedDate,
          }),
        });
        const data = await res.json();
        setTransactions(data);
      }
    };

    fetchSalesData();
  }, [selectedDate]);

  // Format time of initiated transaction

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
    

  return (
    <>
      <div className='justify-center align-center self-center'>
        <h1 className='text-red-900 font-sans font-bold text-xl pb-2'>View Transactions</h1>
        <div style={wrapperStyle} className='w-full md:w-[28rem] shadow-md'>
          <Calendar fullscreen={false} onPanelChange={onPanelChange} onSelect={onDateSelect} />
        </div>
      </div>
      <Drawer
        title={`Transactions for ${selectedDate?.format('MMMM D, YYYY')}`}
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        size='large'
      >
        {/* Content for the drawer goes here */}
        <div className="w-full">
                    <div className="bg-red-primary/15 flex font-bold">
                        <div className="text-left p-2 flex-1">Type</div>
                        <div className="text-left p-2 flex-1">Payment</div>
                        <div className="text-left p-2 flex-1">Staff</div>
                        <div className="text-left p-2 flex-1">Time</div>
                    </div>
                    <div className="divide-y">
                      {transactions.map((item) => (
                              <Link key={item.id} href={'test'}>
                                  <div key={item.id} className="flex hover:bg-red-primary/5">
                                      <div className="p-4 flex-1">
                                        <Badge status={item.delivery ? "success" : "processing"} text={item.delivery ? "Delivery" : "Store"} className='text-xs'/>
                                      </div>
                                      <div className="p-4 flex-1">
                                        {item.paymentMethod}
                                      </div>
                                      <div className="p-4 flex-1"><Avatar src={`${item.user}`} style={{ backgroundColor: '#fde3cf' }}></Avatar></div>
                                      <div className="p-4 flex-1">
                                        {formatTransactionTime(item.createAt)}
                                      </div>
                                  </div>
                              </Link>
                          ))}
                    </div>
                </div>
      </Drawer>
    </>
  );
};

export default CalendarTransaction;
