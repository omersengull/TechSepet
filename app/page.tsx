"use client";
import React, { useEffect } from "react";
import Products from "./components/Home/Products";
import { SessionProvider } from "next-auth/react";
import assignSpecifications from "./fetching";


export default function Home() {
  useEffect(() => {
    assignSpecifications();
}, []);
  return (
    <SessionProvider>
      <Products />
    </SessionProvider>
  );
}