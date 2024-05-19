import { cn } from "@/lib/utils"
import Image from "next/image"
    
// Nav Button Components
export const NavButton = ({ children, active}: any) => {
    return (
        <button className={cn("group flex-wrap items-center flex w-full md:w-28 justify-center cursor-pointer hover:bg-red-50 mx-1 mb-1 hover:rounded-md", 
        active && "border-t-4 md:border-t-0 md:border-b-4 border-solid border-red-primary font-semibold hover:rounded-none hover:bg-white mb-1 md:mb-0")}>
            {children}
        </button>   
    )
}

// Nav Icon Components
export const NavIcon = ({ children }: any) => {
    return (    
        <>
        <span className="text-red-primary text-2xl px-5">
            {children}
        </span>
        </>
    )
}

// Nav Label Components
export const NavLabel = ({ children }: any) => {
    return (
        <>
            <span className={cn("text-[8px] md:text-xs text-nowrap md:hidden group-hover:block text-red-primary")}>
                {children}
            </span>
        </>
    )
}   