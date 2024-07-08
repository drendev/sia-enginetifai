"use client"
import React, { useState } from "react";

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHistory: any[];
  sortOrder: "newest" | "oldest";
  onSortOrderChange: (order: "newest" | "oldest") => void;
  engineFilter: string | null;
  onEngineFilterChange: (engine: string | null) => void;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transactionHistory,
  sortOrder,
  onSortOrderChange,
  engineFilter,
  onEngineFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle sorting order change
  const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortOrderChange(event.target.value as "newest" | "oldest");
  };

  // Function to handle engine filter change
  const handleEngineFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEngine = event.target.value;
    onEngineFilterChange(selectedEngine !== "" ? selectedEngine : null);
  };

  // Function to handle search term change
  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter and sort transaction history based on selected options
  const filteredAndSortedHistory = transactionHistory
    .filter((item) => !engineFilter || item.engineName === engineFilter)
    .filter((item) =>
      searchTerm === "" ||
      item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.engineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.place.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-500 bg-opacity-50">
          <div className="relative mx-auto my-6 w-full max-w-lg">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none">
              <div className="flex items-start justify-between p-4 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-4 flex flex-col flex-1 overflow-y-auto max-h-96">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Filter by engine:</label>
                  <select
                    value={engineFilter || ""}
                    onChange={handleEngineFilterChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">All engines</option>
                    <option value="Engine ABC">Engine ABC</option>
                    <option value="Engine XYZ">Engine XYZ</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Search:</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Search by tracking number, engine name, or place..."
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  {filteredAndSortedHistory.map((transaction, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-base font-semibold">
                        Transaction Number: {transaction.trackingNumber}
                      </p>
                      <div className="flex items-center">
                        <p className="text-sm">
                          <span className="font-semibold">Order Date:</span>{" "}
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm ml-4">
                          <span className="font-semibold">Engine Name:</span>{" "}
                          {transaction.engineName}
                        </p>
                        <p className="text-sm ml-4">
                          <span className="font-semibold">Place:</span> {transaction.place}
                        </p>
                      </div>
                      <hr className="border-gray-400 dark:border-gray-700 mt-2" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 flex items-center justify-end border-t border-solid border-gray-300 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionHistoryModal;

