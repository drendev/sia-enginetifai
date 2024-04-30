'use client';
    
import { Header } from "@/components/ui/index/header";
import Signin from "@/components/auth/SignIn";
import Services from "@/components/ui/index/services";
import Footer from "@/components/ui/index/footer";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function Index() {
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
    return (
        <>
        <main className="min-h-full w-full flex flex-col bg-waves bg-no-repeat bg-cover">
        <div className="flex-1 flex flex-col items-center justify-center">
        <Header />
        <div className="flex max-md:flex-wrap-reverse max-md:mt-10 max-md:gap-32 items-center justify-center relative md:gap-10 lg:gap-10">
        <Services />
        <Signin />
        </div>
        <Footer />
        </div>
        </main>
        </>
    )
}