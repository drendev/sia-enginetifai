
import UserHeader from "./userheader";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Dropdown() {
    const session = await getServerSession(authOptions);
    const image = session?.user?.picture
    
    return(
        <UserHeader>
            <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-slate-300">
                    {session?.user?.username}
                </span>
                <span className="block text-xs text-black dark:text-slate-300">
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
        </UserHeader>
    )
}