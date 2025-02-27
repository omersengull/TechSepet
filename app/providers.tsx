"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./provider/ThemeProvider"; 
import { SpinnerProvider } from "./spinner/SpinnerContext";
import CartProvider from "./provider/CartProvider";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SpinnerProvider>
          <CartProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </SpinnerProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
