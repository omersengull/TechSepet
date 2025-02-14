'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCreditCard } from "react-icons/fa6";
import useCart from './hooks/useCart';
import priceClip from './utils/priceClip';
import { useRouter } from 'next/navigation';
type PaymentData = {
  userId: string;
  items: string; // Ürünlerin JSON string olarak geldiği düşünülüyor
  totalPrice: number;
};
const FormPayment = () => {
  const router=useRouter();
  const {removeItemsFromCart}=useCart();
  const handlePaymentSuccess = async (paymentData: PaymentData) => {
    try {
      const addressId = localStorage.getItem('selectedAddressId'); // 📌 localStorage'dan adres ID'si alınır
  
      const response = await fetch('/api/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: addressId, // ✅ API isteğine adres ID'si eklenir
          userId: paymentData.userId,
          items: paymentData.items,
          totalPrice: paymentData.totalPrice,
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        console.log('Order added successfully:', result.order);
      } else {
        console.error('Failed to add order:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const { cartPrdcts } = useCart();
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setExpireMonth] = useState('');
  const [expireYear, setExpireYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [holderName, setHolderName] = useState('');
  const [response, setResponse] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let total = 0;
    cartPrdcts?.forEach(prd => {
      total += Number(prd.price) * prd.quantity;
    });
    setTotalPrice(total);
  }, [cartPrdcts]);

  const handlePayment = async () => {
    try {
        const response = await fetch("https://www.techsepet.shop/api/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderId: "123456",
                amount: "100.00",
                currency: "TRY",
                buyerEmail: "test@example.com",
                buyerName: "Ahmet Yılmaz",
                successUrl: "https://www.techsepet.shop/payment-success",
                failUrl: "https://www.techsepet.shop/payment-fail"
            }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && data.paymentUrl) {
            window.location.href = data.paymentUrl; // Kullanıcıyı ödeme sayfasına yönlendir
        } else {
            console.error("Ödeme bağlantısı alınamadı:", data);
        }
    } catch (error) {
        console.error("Ödeme başlatılamadı:", error);
    }
};



  return (
    <div className='h-screen flex flex-col gap-4 items-center justify-center'>
      <div className='border-2 px-24 py-10 border-gray-400  rounded-lg p-6'>
        <h1 className='text-3xl text-black text-center mb-4'>Ödeme Formu</h1>
        <div className='flex flex-col w-96 gap-3'>
          <input
            className='flex flex-row px-3 py-3 rounded-lg border-2 w-full'
            type="text"
            placeholder="Kart Sahibi"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
          />
          <div className='flex items-center rounded-lg border-2'>
            <input
              className='px-3 py-3  border-none w-full outline-none'
              type="text"
              placeholder="Kart Numarası"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <FaCreditCard className='mr-2' />
          </div>
          <div className='flex flex-row gap-3'>
            <input
              className='px-3 py-3 rounded-lg border-2 w-full'
              type="text"
              placeholder="Son Kullanma Ayı"
              value={expireMonth}
              onChange={(e) => setExpireMonth(e.target.value)}
            />
            <input
              className='px-3 py-3 rounded-lg border-2 w-full'
              type="text"
              placeholder="Son Kullanma Yılı"
              value={expireYear}
              onChange={(e) => setExpireYear(e.target.value)}
            />
          </div>
          <input
            className='px-3 py-3 rounded-lg border-2 w-full'
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
          <button className='bg-renk1 mt-2 text-white py-3 rounded-xl' onClick={handlePayment}>
            ₺ {totalPrice > 1000 ? `${priceClip(totalPrice)}` : `${priceClip(totalPrice)} + 39`} Öde
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPayment;
