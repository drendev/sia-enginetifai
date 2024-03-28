'use client';

import Loading from "../loading";
import Maintenance from "./@index/maintenance";
import Index from "./@index/page";
import { useEffect, useState } from "react";

export default function Home() {
    const isLoggedIn = false;
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
    if (!isLoggedIn) {
  return (
    <Index />
  );
    }
}
