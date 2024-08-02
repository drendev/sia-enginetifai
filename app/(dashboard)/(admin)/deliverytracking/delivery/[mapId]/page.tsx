"use client"
// MapComponent.tsx

import React, { useState, useEffect } from "react";
import TransactionHistoryModal from "@/components/dashboard/main/delivery/TransactionHistoryModal"; // Import your modal component
import MapboxComponent2 from "@/components/dashboard/main/delivery/maplocator";
import DeliveryTracking from "@/components/dashboard/main/delivery/DeliveryTracking";
import { PackageInformationCard, TransactionHistoryCard } from "@/components/dashboard/main/delivery/TransactionHistory";

export default function Page({ params }: { params: { mapId: string } }) {

return (
    <div className="flex font-sans bg-red-50 flex-col md:flex-row h-auto md:w-full p-4 pt-20">
    {/* Left Side Content */}
    <div className="flex flex-col md:w-[40rem] w-full">

        {/* Adding New Package Card */}
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
        transactionId={Number(params.mapId)}
        />

        {/* Transaction History Card */}
        <TransactionHistoryCard
        transactionId={Number(params.mapId)}
        />
        
    </div>

    {/* Right Side Content (Map Component) */}
    <div className="md:flex-1 md:ml-4 w-full">
        <MapboxComponent2 
        transactionId={Number(params.mapId)}
        />
        <DeliveryTracking/>
    </div>
    </div>
);
};

