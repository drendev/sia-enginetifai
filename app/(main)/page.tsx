'use client';

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import Loading from "./loading";

export default function Home() {
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
    <div>
        Something went wrong.
    </div>
  );
}
