'use client';

import Loading from "../loading";
import Maintenance from "./@index/maintenance";
import Index from "./@index/page";
import { useEffect, useState } from "react";

export default function Home() {
    const isLoggedIn = false;

    if (!isLoggedIn) {
  return (
    <Index />
  );
    }
}
