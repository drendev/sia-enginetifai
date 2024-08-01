"use client"
// MapComponent.tsx

import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowRight, FaUser, FaEnvelope } from "react-icons/fa";
import TransactionHistoryModal from "@/components/dashboard/main/delivery/TransactionHistoryModal"; // Import your modal component
import MapboxComponent from "@/components/dashboard/main/delivery/MapboxComponent";
import DeliveryTracking from "@/components/dashboard/main/delivery/DeliveryTracking";
import { PackageInformationCard, TransactionHistoryCard } from "@/components/dashboard/main/delivery/TransactionHistory";
import { PlusOutlined } from "@ant-design/icons";

const generateTransactionNumber = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let result = "";

  // Generate 4 random letters
  for (let i = 0; i < 4; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate 4 random numbers
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
};

export default function Page({ params }: { params: { trackId: string } }) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [engineName, setEngineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [place, setPlace] = useState("");
  const [transactionHistory, setTransactionHistory] = useState<any[]>([
    {
      trackingNumber: generateTransactionNumber(),
      date: "2024-06-21",
      engineName: "Engine ABC",
      place: "Place A",
      action: "Added",
    },
    {
      trackingNumber: generateTransactionNumber(),
      date: "2024-06-20",
      engineName: "Engine XYZ",
      place: "Place B",
      action: "Removed",
    },
    // Additional mock transaction history items can be added here
  ]);

  // State variables for modal and filters
  const [showTransactionHistoryModal, setShowTransactionHistoryModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [engineFilter, setEngineFilter] = useState<string | null>(null);


  const handleAddButtonClick = () => {
    // Generate transaction number when opening the form modal
    const generatedTransactionNumber = generateTransactionNumber();

    // Set initial form values
    setTrackingNumber(generatedTransactionNumber);
    setEngineName("");
    setQuantity("");
    setPlace("");

    setShowAddForm(true); // Open the form modal
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newPackage = {
      trackingNumber,
      departureDate: "2024-06-21",
      arrivalDate: "2024-06-22",
      EngineID: "142002",
      engineName,
      quantity: parseInt(quantity),
      driverName: "kuya roel",
    };

    // Update packages state
    setPackages(newPackage);

    // Update transaction history
    setTransactionHistory((prevHistory) => [
      ...prevHistory,
      {
        trackingNumber,
        date: new Date().toLocaleString(),
        engineName,
        place,
        action: "Added",
      },
    ]);

    // Reset form fields and close modal
    setTrackingNumber("");
    setEngineName("");
    setQuantity("");
    setPlace("");
    setShowAddForm(false);
  };


  const handleMapSubmit = () => {
    // Handle map submission logic if needed
  };

  // Filter and sort transaction history based on selected options
  const filteredAndSortedHistory = transactionHistory
    .filter((item) => !engineFilter || item.engineName === engineFilter)
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  return (
    <div className="flex font-sans bg-red-50 flex-col md:flex-row h-auto md:w-full pt-20 p-4">
      {/* Left Side Content */}
      <div className="flex flex-col md:w-[40rem] w-full">

        {/* Adding New Package Card */}
        <div className="dark:bg-gray-900 bg-red-200 rounded-lg p-6 shadow-md mb-2 w-full bg-no-repeat bg-cover" style={{ backgroundImage: `url("./bg-red.png")` }}>
        <div className="flex items-center justify-between p-2 ">
            <div>
              <p className="text-red-100 text-4xl font-sans font-extrabold pb-2">
                Add New Package
              </p>
              <h1 className="text-sm text-white dark:text-white pl-1 pb-3">
                Fill out the form to create new package
              </h1>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <button
              className="flex bg-red-primary hover:bg-red-primary text-white font-bold rounded-full md:w-30 text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2"
              onClick={handleAddButtonClick}
            > New Package <PlusOutlined className="pl-2 pt-1" />
            </button>
          </div>
        </div>


        {/* Package Information Card */}
        <PackageInformationCard packages={packages} />

        {/* Transaction History Card */}
        <TransactionHistoryCard
          transactionHistory={transactionHistory}
          setPackages={setPackages}
          onSeeMore={() => setShowTransactionHistoryModal(true)} // Set showModal state to true
        />
        
      </div>

      {/* Add Package Form */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[30rem]">
            <h2 className="text-lg font-semibold mb-4">Add a New Package</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Engine Name</label>
                <select
                  value={engineName}
                  onChange={(e) => setEngineName(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                  required
                >
                  <option value="">Select Engine</option>
                  <option value="Engine ABC">Engine ABC</option>
                  <option value="Engine XYZ">Engine XYZ</option>
                  <option value="Engine 123">Engine 123</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Place</label>
                <input
                  type="text"
                  placeholder="Place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right Side Content (Map Component) */}
      <div className="md:flex-1 md:ml-4 w-full">
        <MapboxComponent 
        transactionId={Number(params.trackId)}
        />
        <DeliveryTracking/>
      </div>

      {/* Transaction History Modal */}
      {showTransactionHistoryModal && (
          <TransactionHistoryModal
            isOpen={showTransactionHistoryModal}
            onClose={() => setShowTransactionHistoryModal(false)}
            transactionHistory={filteredAndSortedHistory}
            sortOrder={sortOrder}
            onSortOrderChange={(order) => setSortOrder(order)}
            engineFilter={engineFilter}
            onEngineFilterChange={(engine) => setEngineFilter(engine)}
          />
        )}

    </div>
  );
};

