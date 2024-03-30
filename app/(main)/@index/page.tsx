'use client';
    
import { Header } from "@/components/ui/index/header";
import Signin from "./signin";
import Services from "./services";
import Footer from "./footer";

export default function Index() {
    return (
        <>
        <div className="min-h-full min-w-full flex flex-col bg-waves bg-no-repeat bg-cover">
        <main className="flex-1 flex flex-col items-center justify-center">
        <Header />
        <div className="flex max-md:flex-wrap-reverse max-md:m-5 max-md:mt-5 max-md:gap-10 items-center justify-center m-8 relative gap-10">
        <Services />
        <Signin />
        </div>
        <Footer />
        </main>
        </div>
        </>
    )
}