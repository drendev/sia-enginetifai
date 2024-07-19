"use client"

import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export function EngineTypesChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const data = {
        labels: ['Silent Diesel Generator', 'Open Type Diesel Generator', 'Diesel Engine', 'Twin-Cylinder Diesel Engine', 'Twin-Cylinder Diesel Generator', 'Diesel High Pressure Pump', 'Gasoline Engine', 'Inverter Generator', 'Tillers', 'Gasoline Iron Pump',],
        datasets: [{
          label: 'Transactions',
          data: [30, 50, 30, 40, 50, 60, 70, 90, 20, 10],
          backgroundColor: '#BB4747',
          borderRadius: 10,
          borderWidth: 0,
          barThickness: 14,
          categorySpacing: 1,
          barPercentage: 1,
          fill: true,
          barPadding: 0,
        }]
      };

      const config = {
        type: 'bar' as const,
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
            title: {
              display: false, // Hide the title
            },
            datalabels: {
                display: false, // Hide the data labels
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Hide grid lines on x-axis
              },
              ticks: {
                display: false, // Show labels on x-axis
              },
              border: {
                display: false, // Hide the border
              }

            },
            y: {
              grid: {
                display: false, // Hide grid lines on y-axis
              },
              ticks: {
                display: false, // Hide labels on y-axis
              },
              border: {
                display: false, // Hide the border
              }
            },
          }
        },
      };

      const myChart = new Chart(chartRef.current, config);

      // Cleanup function to destroy the chart when the component unmounts
      return () => {
        myChart.destroy();
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
