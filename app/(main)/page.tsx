'use client';

import Loading from "../loading";
import Index from "./@index/page";
import { useEffect, useState } from "react";

export default async function Home() {
    const isLoggedIn = false;
    const [ready, setReady] = useState(false);

      useEffect(() => {
        const timer = setTimeout(() => {
          setReady(true); 
        }, 2000);

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
