"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PoweroffOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ToggleMode from "../darkmode/ToggleMode";

export default function UserHeader({children}: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<any>(null);
    const dropdown = useRef<any>(null);

    const router = useRouter();

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
        if (!dropdown.current) return;
        if (
            !dropdownOpen ||
            dropdown.current.contains(target) ||
            trigger.current.contains(target)
        )
            return;
        setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
        if (!dropdownOpen || keyCode !== 27) return;
        setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return(
        <div className="flex mr-2 md:mr-5 p-1">
        <div className="flex justify-center self-center mt-1">
        <button
            ref={trigger}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 md:gap-4 hover:opacity-60 active:opacity-85"
            >
                {children}
        </button>
        </div>
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 mt-12 flex w-60 flex-col rounded-xl mr-5 border border-stroke bg-white shadow-md dark:border-slate-700 z-[1000] dark:bg-slate-900 ${
                dropdownOpen === true ? "block" : "hidden"
                }`}
            >
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-6 dark:border-slate-700 z-[1000]">
                    <li>
                        <ToggleMode />
                    </li>
                    <li>
                        <Link className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out text-red-primary hover:opacity-60 active:opacity-90 lg:text-sm" href="/profile">
                            Profile
                        </Link>
                    </li>
                </ul>
                <button 
                className="flex items-center gap-3.5 px-6 py-4 text-sm font-bold duration-300 ease-in-out text-red-primary hover:opacity-60 active:opacity-90 lg:text-sm"
                onClick={(e) => {
                    e.preventDefault();
                    signOut();
                    router.push("/");
                }}>
                    <span>
                    <PoweroffOutlined />
                    </span>
                    Sign Out
                </button>
            </div>
            </div>
    )
    }