"use client"

import React from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";

interface PackageProps {
  packages: any; // Define your type for packages
}

interface TransactionHistoryProps {
  transactionHistory: any[]; // Define your type for transactionHistory
  setPackages: React.Dispatch<React.SetStateAction<any>>;
}

export const PackageInformationCard: React.FC<PackageProps> = ({ packages }) => (
  <div className="dark:bg-gray-900 bg-white rounded-lg p-4 shadow-md mb-4 w-full dark:text-black-500">
    <div className="mb-2">
      <h1 className="text-base text-black-600 dark:text-white">
        Transaction Number
      </h1>
      <p className="text-xl font-bold mb-2">
        {packages.trackingNumber || "No package selected"}
      </p>
      <hr className="my-2 border-red-600 dark:border-gray-700" />
      <div className="flex flex-wrap justify-between">
        <div className="w-full mb-4 flex">
          <div className="w-1/2">
            <p className="font-semibold">Order Date</p>
            <p>{packages.date || "-"}</p>
          </div>
          <div className="w-1/2">
            <p className="font-semibold">Engine Name</p>
            <p>{packages.engineName || "-"}</p>
          </div>
        </div>
      </div>

      <hr className="my-2 border-red-600 dark:border-gray-700" />

      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-[30%] mb-4">
          <p className="font-semibold">Place</p>
          <p>{packages.place || "-"}</p>
        </div>
        <div className="w-full md:w-[30%] mb-4">
          <p className="font-semibold">Quantity</p>
          <p>{packages.quantity || "-"}</p>
        </div>
      </div>

      <div className="flex items-center mt-2">
        <FaUser className="text-gray-500 dark:text-gray-300 mr-2 ml-2" />
        <p>{packages.driverName || "-"}</p>
        <button className="ml-auto flex items-center bg-red-700 text-white p-2 rounded-lg">
          <FaEnvelope className="mr-2 ml-2" />
        </button>
      </div>
    </div>
  </div>
);

export const TransactionHistoryCard: React.FC<TransactionHistoryProps> = ({
  transactionHistory,
  setPackages,
}) => (
  <div className="dark:bg-gray-900 bg-white rounded-lg p-4 shadow-md mb-4 w-full h-100">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-lg font-semibold text-black-200 dark:text-white p-1">
          Transaction History
        </p>
        <h1 className="text-sm text-gray-500 dark:text-white pl-1">
          Recent transactions and details
        </h1>
      </div>
      <button
        className="px-4 py-2 bg-red-700 text-white rounded-lg"
        onClick={() => setShowTransactionHistoryModal(true)}
      >
        See more
      </button>
    </div>
    <hr className="my-2 border-red-700 dark:border-gray-700" />

    {/* Displaying Recent Transactions */}
    <div className="max-h-60 overflow-y-auto">
      {transactionHistory.map((transaction, index) => (
        <div
          key={index}
          className="mb-4 cursor-pointer"
          onClick={() => {
            setPackages(transaction); // Set selected package details
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-lg font-semibold">
                Transaction Number: {transaction.trackingNumber}
              </p>
              <div className="flex items-center">
                <p className="text-sm">
                  <span className="font-semibold">Order Date:</span>{" "}
                  {new Date(transaction.date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-sm ml-4">
                  <span className="font-semibold">Engine Name:</span>{" "}
                  {transaction.engineName}
                </p>
                <p className="text-sm ml-4">
                  <span className="font-semibold">Place:</span>{" "}
                  {transaction.place}
                </p>
                <p className="text-sm ml-4">
                  <span className="font-semibold">Quantity:</span>{" "}
                  {transaction.quantity}
                </p>
              </div>
            </div>
          </div>
          <hr className="border-red-700 dark:border-gray-700" />
        </div>
      ))}
    </div>
  </div>
);
function setShowTransactionHistoryModal(arg0: boolean): void {
  throw new Error("Function not implemented.");
}

