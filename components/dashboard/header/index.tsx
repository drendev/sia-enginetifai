"use client"

import UserHeader from "./navbar/userheader";
import { useRef, useState } from "react";
import { GetRef, Tour, TourProps } from "antd";
import { NavAdmin } from "./navbar/admin/admin-nav";
import { NavLogo } from "./navbar/nav-logo";

const DashboardHeader = () => {
    const ref1 = useRef<GetRef<any>>(null);
    const ref2 = useRef<GetRef<any>>(null);
    const ref3 = useRef<GetRef<any>>(null);

    const steps: TourProps['steps'] = [
        {
          title: 'Icon',
          description: 'Test description for icon.',
          target: () => ref1.current!,
        },
        {
          title: 'Navbars',
          description: 'Select icons to navigate to different features.',
          target: () => ref2.current!,
        },
        {
          title: 'Profile',
          description: 'Edit Profile and Logout.',
          target: () => ref3.current!,
        },
      ];

      const [open, setOpen] = useState<boolean>(true);

    return (
      <>
        <header className="stick-0 top-0 flex justify-between w-full shadow-md md:h-14 h-12">
            <span ref={ref1}>
              <NavLogo />
            </span>
            <div ref={ref2} className="justify-evenly pt-1 hidden md:flex md:sticky">           
                <NavAdmin />
            </div>
            <span ref={ref3}>
            <UserHeader />
            </span>
            <Tour
              open={open}
              onClose={() => setOpen(false)}
              steps={steps}
              indicatorsRender={(current, total) => (
                <span>
                  {current + 1} / {total}
                </span>
              )}
            />
        </header>
        <footer className="flex bottom-0 fixed md:hidden justify-evenly w-full mb-1 shadow-top-md">
              <NavAdmin />
        </footer>
      </>
    )
}

export default DashboardHeader;