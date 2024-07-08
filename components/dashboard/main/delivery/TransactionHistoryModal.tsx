"use client"
import React, { useState, useEffect } from "react";

interface Transaction {
  trackingNumber: string;
  date: string;
  engineName: string;
  place: string;
  action: string;
}

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHistory: Transaction[];
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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Filter transactions based on search term
    const filtered = transactionHistory.filter((transaction) =>
      transaction.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.engineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactionHistory]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-500 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[50rem] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            Close
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by transaction number, engine name, or date..."
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Transaction history list */}
        <ul className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction, index) => (
            <li key={index} className="py-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Transaction Number: {transaction.trackingNumber}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                  <p className="text-sm text-gray-500">{transaction.place}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                  {transaction.action}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Modal footer - sorting and filtering controls */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <label className="mr-2">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as "newest" | "oldest")}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Filter by engine:</label>
            <select
              value={engineFilter || ""}
              onChange={(e) => onEngineFilterChange(e.target.value || null)}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              <option value="">All Engines</option>
              <option value="Engine ABC">Engine ABC</option>
              <option value="Engine XYX">Engine XYZ</option>
              <option value="Engine 123">Engine 123</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;


