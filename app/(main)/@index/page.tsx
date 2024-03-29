'use client';
    
import { Header } from "@/components/ui/index/header";
import Signin from "./signin";
import Services from "./services";
import Footer from "./footer";

export default function Index() {
    return (
        <>
        <Header />
        <div className="flex max-md:flex-wrap-reverse max-md:m-5 max-md:mt-5 max-md:gap-10 items-center justify-center m-8 relative gap-10">
        <Services />
        <Signin />
        </div>
        <Footer />
        </>
    )
}