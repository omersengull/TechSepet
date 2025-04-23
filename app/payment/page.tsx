"use client";

import React, { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import dynamic from 'next/dynamic';
import FormPayment from '../formPayment';

// React Router'ı kullanan bir bileşen, dinamik olarak import edilecek
const RouterProvider = ({ children }) => {
  // Bu bileşen sadece client tarafında oluşturulduğu için güvenle import edilebilir
  const { BrowserRouter } = require('react-router-dom');
  return <BrowserRouter>{children}</BrowserRouter>;
};

// RouterProvider'ı dinamik olarak import ediyoruz (sadece client tarafında)
const DynamicRouterProvider = dynamic(
  () => Promise.resolve(RouterProvider),
  { ssr: false }
);

const PaymentPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Stripe'ı sadece client tarafında yükle
  const stripePromise = loadStripe("pk_test_51R68bCLFXUo4EH8bri3AyKUwFd21mcn2ecRjwP9Q0csZHeXZbA9dh5Mg77pkc17ypzrSBd5SX9OE24a1uaLGcvO100TpnRPk5N");

  // Server tarafında render edilirken yükleniyor göster
  if (!isMounted) {
    return <div className="h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <SessionProvider>
      <DynamicRouterProvider>
        <Elements stripe={stripePromise}>
          <FormPayment />
        </Elements>
      </DynamicRouterProvider>
    </SessionProvider>
  );
};

// Tüm sayfayı client-side only olarak export et
export default dynamic(() => Promise.resolve(PaymentPage), { ssr: false });