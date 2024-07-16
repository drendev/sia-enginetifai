"use client";

import React, { useState } from 'react';
import { Calendar, Drawer, theme } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

const CalendarTransaction: React.FC = () => {
  const { token } = theme.useToken();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const wrapperStyle: React.CSSProperties = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
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
        title={`Transactions for ${selectedDate?.format('YYYY-MM-DD')}`}
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        {/* Content for the drawer goes here */}
        <p>Details for the selected date: {selectedDate?.format('YYYY-MM-DD')}</p>
      </Drawer>
    </>
  );
};

export default CalendarTransaction;
