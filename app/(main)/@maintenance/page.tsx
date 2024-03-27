'use client';

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import Loading from "../loading";

export default function Maintenance() {
  // Loading state
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []); 

  if (!ready) {
    return <div><Loading /></div> 
  }

  return (
    <div className="flex flex-col items-center">
    <Image src="/maintenance.svg" width={200} height={200} alt="EnginetifAI" />
    <header className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-8 text-red-primary">EnginetifAI</h1>
      <p className="text-lg mt-4 text-gray-500 px-6 text-center lg:max-2xl:mb-40">
      AI-Powered solution for Inventory Management System. 
      <span className="text-lg font-bold text-gray-500 ml-1">
      Coming Soon.
      </span>
      </p>
    </header>
    <div className="absolute bottom-0 mt-8">
      <Image src={"/wave.svg"} width={2990} height={1068} alt="Waves" />
    </div>
  </div>  
  );
}
