"use client";
import React from "react";
import Products from "./components/Home/Products";
import { SessionProvider } from "next-auth/react";


export default function Home() {
  return (
    <SessionProvider>
      <Products />
    </SessionProvider>
  );
}