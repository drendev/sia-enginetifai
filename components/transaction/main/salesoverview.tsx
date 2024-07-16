"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Select } from 'antd'; // Import the Select component from antd

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ChartDataLabels
);

const { Option } = Select;

const monthlyLabels = ["January", "February", "March", "April", "May", "June", "July"];
const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthlyData = [10, 200, 180, 120, 230, 300, 320];
const weeklyData = [15, 30, 45, 60, 75, 90, 105];

const options: ChartOptions<"line"> = {
  plugins: {
    datalabels: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          label += `₱${context.parsed.y}`;
          return label;
        },
      },
    },
    legend: {
      display: false,
      position: "top",
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: false,
        text: "Month",
      },
    },
    y: {
      display: true,
      title: {
        display: false,
        text: "Value",
      },
      ticks: {
        display: false,
      },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};

export function SalesOverview() {
  const [timeframe, setTimeframe] = useState("monthly");

  const data = {
    labels: timeframe === "monthly" ? monthlyLabels : weeklyLabels,
    datasets: [
      {
        label: "Sales",
        data: timeframe === "monthly" ? monthlyData : weeklyData,
        fill: true,
        borderColor: "#BB4747",
        backgroundColor: "rgba(208, 113, 113, 0.4)",
        tension: 0.6,
        pointRadius: 3,
        pointHitRadius: 100,
      },
    ],
  };

  return (
    <div>
        <div className="flex justify-between">
            <h1 className='text-red-900 font-sans font-bold text-xl pb-2'> Sales Overview </h1>
            <Select
                defaultValue="monthly"
                style={{ width: 120, marginBottom: 20 }}
                onChange={(value) => setTimeframe(value)}
            >
                <Option value="monthly">Monthly</Option>
                <Option value="weekly">Last week</Option>
            </Select>
        </div>
      
      <Line data={data} options={options} />

      <div className="grid grid-cols-2">
        <div className="p-1 font-sans">
          <span className="font-sans font-bold text-red-primary">Total Sales Recorded:</span>
          <h1> ₱10,000</h1>
        </div>
        <div className="p-1 font-sans">
          <span className="font-sans font-bold text-red-primary">This Month Sales: </span>
          <h1> ₱10,000</h1>
        </div>
        <div className="p-1 font-sans">
          <span className="font-sans font-bold text-red-primary">Last Week Sales: </span>
          <h1> ₱10,000</h1>
        </div>
        <div className="font-sans">
          <span className="font-sans font-bold text-red-primary">Last Month Sales: </span>
          <h1> ₱10,000</h1>
        </div>
      </div>
    </div>
  );
}
