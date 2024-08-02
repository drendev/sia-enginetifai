"use client"
// MapComponent.tsx

import React, { useState, useEffect } from "react";
import MapboxComponent from "@/components/dashboard/main/delivery/MapboxComponent";
import MapboxComponent2 from "@/components/dashboard/main/delivery/maplocator"; // Import the second map component
import DeliveryTracking from "@/components/dashboard/main/delivery/DeliveryTracking";
import { PackageInformationCard, TransactionHistoryCard } from "@/components/dashboard/main/delivery/TransactionHistory";
import { useSession } from "next-auth/react";

interface DeliveryUser {
  deliveryUser: string;
  deliverStatus: string;
}

export default function Page({ params }: { params: { trackId: string } }) {
  const [deliveryUser, setDeliveryUser] = useState<DeliveryUser | null>(null);

  // fetch current user
  const { data: session } = useSession();
  const currentUser = session?.user?.username;

  const fetchEngineData = async () => {
    try {
      const res = await fetch(`/api/delivery/fetchdelivery?transactionId=${params.trackId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setDeliveryUser(data);
    } catch (error) {
      console.error('Failed to fetch destination:', error);
    }
  };

  useEffect(() => {
    fetchEngineData();
  }, [params.trackId]);

  return (
    <div className="flex font-sans bg-red-50 flex-col md:flex-row h-auto md:w-full pt-20 p-4">
      {/* Left Side Content */}
      <div className="flex flex-col md:w-[40rem] w-full">
        <div className="bg-red-primary rounded-lg p-6 shadow-md mb-2 w-full bg-right-bottom bg-contain bg-no-repeat bg-track">
        <div className="flex items-center justify-between p-2 ">
            <div>
            <p className="text-red-100 text-4xl font-sans font-extrabold pb-2">
                Track Delivery
            </p>
            <h1 className="text-sm text-white dark:text-white pl-1 pb-3">
                Real-Time Delivery Tracking
            </h1>
            </div>
        </div>
        </div>

        {/* Package Information Card */}
        <PackageInformationCard 
        transactionId={Number(params.trackId)}
        />

        {/* Transaction History Card */}
        <TransactionHistoryCard
          transactionId={Number(params.trackId)}
        />

      </div>

      {/* Right Side Content (Map Component) */}
      <div className="md:flex-1 md:ml-4 w-full">
        {deliveryUser?.deliveryUser === currentUser && deliveryUser?.deliverStatus === "pending" ? (
          <MapboxComponent transactionId={Number(params.trackId)} />
        ) : (
          <MapboxComponent2 transactionId={Number(params.trackId)} />
        )}
        <DeliveryTracking />
      </div>
    </div>
  );
};
