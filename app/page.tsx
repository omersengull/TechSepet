"use client";
import React, { useEffect } from "react";
import Products from "./components/Home/Products";
import { SessionProvider } from "next-auth/react";
import Slider from "@/app/components/slider";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // F1 tuşu için event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setIsLoading(true);
        router.push("/help");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Tüm link tıklamalarını yakala
  useEffect(() => {
    const handleRouteChange = () => setIsLoading(true);
    const handleRouteComplete = () => setIsLoading(false);

    // Next.js linkleri için
    const links = document.querySelectorAll("a[href^='/']");
    links.forEach(link => {
      link.addEventListener("click", handleRouteChange);
    });

    // Router eventleri
    window.addEventListener("routeChangeStart", handleRouteChange);
    window.addEventListener("routeChangeComplete", handleRouteComplete);

    return () => {
      links.forEach(link => {
        link.removeEventListener("click", handleRouteChange);
      });
      window.removeEventListener("routeChangeStart", handleRouteChange);
      window.removeEventListener("routeChangeComplete", handleRouteComplete);
    };
  }, []);

  return (
    <SessionProvider>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <HashLoader size={50} />
        </div>
      )}
      
      <Slider />
      <Products />
    </SessionProvider>
  );
}