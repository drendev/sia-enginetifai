"use client"
import React, { useState } from "react";

interface ThirdGridProps {
  
}

const ThirdGrid: React.FC<ThirdGridProps> = (props) => {
  const [selectedInterval, setSelectedInterval] = useState<string>("month");
  const [quantity, setQuantity] = useState<number>(22); 

  const handleIntervalChange = (interval: string) => {
    // Replaec with actual data fetching logic based on interval
    switch (interval) {
      case "month":
        setQuantity(30);
        break;
      case "week":
        setQuantity(7);
        break;
      case "day":
        setQuantity(1);
        break;
      case "year":
        setQuantity(365);
        break;
      default:
        setQuantity(22); // Default 
        break;
    }
    setSelectedInterval(interval);
  };

  return (
    <div className="bg-white-100 border-b border-slate-350 grid grid-cols-12 gap-3 p-4">
      
      <div className="col-span-3">
        <div className="shadow-md rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold mb-4 mt-3">Order per</h2>
            <div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md mr-2 text-sm"
                onChange={(e) => handleIntervalChange(e.target.value)}
                value={selectedInterval}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>
          <hr className="shadow-md border-slate-300 my-4" />
          <h3 className="text-xl text-center text-black-500 font-semibold mt-7">
            Quantity Ordered
          </h3>
          <p className="text-4xl text-center text-red-600 font-semibold mb-7">
            {quantity} pcs
          </p>
        </div>
      </div>

      
      <div className="col-span-9">
        
        {/* Transactions Card */}
        <div className="shadow-md border border-slate-200 rounded-lg bg-white p-4">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Engine
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Engine ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* rows */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Engine Pietro
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ENG-001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Completed
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Engine 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ENG-002
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Pending
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdGrid;
