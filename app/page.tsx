"use client";
import React from "react";
import Products from "./components/Home/Products";
import { SessionProvider } from "next-auth/react";
import Slider from "@/app/components/slider";

export default function Home() {

  return (
    <SessionProvider>
      
        <Slider/>
      <Products />
     
      
      
    </SessionProvider>
  );
}