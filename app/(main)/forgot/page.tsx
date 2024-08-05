import ForgotPasswordOtp from "@/components/auth/forgot";
import Signin from "@/components/auth/SignIn";
import Services from "@/components/ui/index/services";
import { Header } from "@/components/ui/index/header";
import Footer from "@/components/ui/index/footer";

export default function ForgotPage() {
    return(
        <>
        <main className="min-h-full w-full overflow-hidden flex flex-col bg-waves bg-no-repeat bg-cover bg-white">
        <div className="flex-1 flex flex-col items-center justify-center">
        <Header />
        <div className="flex max-md:flex-wrap-reverse max-md:mt-10 max-md:gap-32 items-center justify-center relative md:gap-10 lg:gap-10">
        <Services />
        <ForgotPasswordOtp />
        </div>
        <Footer />
        </div>
        </main>
        </>
    )
}