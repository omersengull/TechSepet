'use client';

import React, { useState, useEffect } from 'react';
import { FaCreditCard } from "react-icons/fa6";
import useCart from './hooks/useCart';
import priceClip from './utils/priceClip';
import { useSession } from "next-auth/react";
type PaymentData = {
  userId: string;
  items: string;
  totalPrice: number;
};

const FormPayment = () => {
  const { cartPrdcts, removeItemsFromCart ,selectedAddressId} = useCart();
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setExpireMonth] = useState('');
  const [expireYear, setExpireYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [holderName, setHolderName] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    let total = 0;
    cartPrdcts?.forEach(prd => {
      total += Number(prd.price) * prd.quantity;
    });
    setTotalPrice(total);
  }, [cartPrdcts]);

  // ✅ Sipariş veritabanına ekleniyor
  const handlePaymentSuccess = async (paymentData: PaymentData) => {
    
    try {
  if (!selectedAddressId ) {
        alert("Adres bilgisi eksik!");
        return;
      }
      else if (!userId ) {
        alert("Kullanıcı bilgisi eksik!");
        return;
      }
      const response = await fetch('/api/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          userId: paymentData.userId,
          items: paymentData.items,
          totalPrice: paymentData.totalPrice,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Sipariş başarıyla eklendi:', result.order);
        setPaymentSuccess(true);

        // ✅ Sipariş başarılı olunca sepeti temizle
        removeItemsFromCart();
      } else {
        console.error('❌ Sipariş eklenemedi:', result.message);
      }
    } catch (error) {
      console.error('🚨 Hata:', error);
    }
  };

  // ✅ Ödeme işlemi
  const handlePayment = async () => {
  

    if (!userId) {
      alert("Kullanıcı bilgisi eksik!");
      return;
    }

    const paymentData: PaymentData = {
      userId,
      items: JSON.stringify(cartPrdcts), // Ürünleri JSON formatına çeviriyoruz
      totalPrice,
    };

    await handlePaymentSuccess(paymentData);
  };

  return (
    <div className='h-screen flex flex-col gap-4 items-center justify-center'>
      <div className='border-2 px-24 py-10 border-gray-400 rounded-lg p-6'>
        <h1 className='text-3xl text-black text-center mb-4'>Ödeme Formu</h1>

        {paymentSuccess ? (
          <p className="text-green-600 text-xl font-bold text-center">✅ Siparişiniz başarıyla tamamlandı!</p>
        ) : (
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
                className='px-3 py-3 border-none w-full outline-none'
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
            <div className="flex items-center"><span><img width={61} className=' rounded-xl px-2 p-2' src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="" /></span>
            <span><img width={61} className=' rounded-xl px-2 p-2' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="" /></span>
            <span><img width={61} className=' rounded-xl px-2 p-2' src="https://www.svgrepo.com/show/328122/paypal.svg" alt="" /></span>
            <span><img width={61} className=' rounded-xl px-2 p-2' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Maestro_2016.svg/300px-Maestro_2016.svg.png" alt="" /></span>
            <span><img width={61} className=' rounded-xl px-2 p-2' src="https://www.svgrepo.com/show/328122/paypal.svg" alt="" /></span>
            <span><img width={61} className=' rounded-xl px-2 p-2' src="https://image.troyodeme.com/troy-logo-14.png" alt="" /></span></div>
            <button
              className='bg-renk1 mt-2 text-white py-3 rounded-xl'
              onClick={handlePayment}
            >
              ₺ {totalPrice > 1000 ? `${priceClip(totalPrice)}` : `${priceClip(totalPrice)} + 39`} Öde
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPayment;
