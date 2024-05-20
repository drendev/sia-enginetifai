"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PoweroffOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";

export default function UserHeader() {
    const { data: session } =  useSession();

    const image = session?.user?.picture

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<any>(null);
    const dropdown = useRef<any>(null);

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
                <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                    {session?.user?.username}
                </span>
                <span className="block text-xs">
                    {session?.user?.role}
                </span>
                </span>

                <span className="md:h-10 md:w-10 h-8 w-8 rounded-full border-solid overflow-hidden border-red-primary border-1">
                <img
                    className="inherit"
                    src={`${image}`}
                    style={{
                    width: "100%",
                    height: "100%",
                    }}
                    alt="User Photo"
                />
                </span>
                <svg
                className="fill-current"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                    fill=""
                />
                </svg>
        </button>
        </div>
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 mt-12 flex w-60 flex-col rounded-xl mr-5 border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark ${
                dropdownOpen === true ? "block" : "hidden"
                }`}
            >
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-6 dark:border-strokedark">
                    <li>
                        <Link className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out text-red-primary hover:opacity-60 active:opacity-90 lg:text-sm" href="/upload-picture">
                            Change Profile Picture
                        </Link>
                    </li>
                    <li>
                    <Link
                        href="#"
                        className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out text-red-primary hover:opacity-60 active:opacity-90 lg:text-sm"
                        >
                        Settings
                    </Link>
                    </li>
                    <li>
                    <Link
                        href="#"
                        className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out text-red-primary hover:opacity-60 active:opacity-90 lg:text-sm"
                    >
                        Help
                    </Link>
                    </li>
                </ul>
                <button 
                className="flex items-center gap-3.5 px-6 py-4 text-sm font-bold duration-300 ease-in-out text-red-primary hover:opacity-60 active:opacity-90 lg:text-sm"
                onClick={(e) => {
                    e.preventDefault();
                    signOut();
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