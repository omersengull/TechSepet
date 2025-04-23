'use client';

import React, { useState, useEffect } from 'react';
import { FaCreditCard } from "react-icons/fa";
import useCart from './hooks/useCart';
import priceClip from './utils/priceClip';
import { useSession } from "next-auth/react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Stripe için gerekli import
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

type PaymentData = {

    userId: string;
    items: string;
    totalPrice: number;
};

const formPayment = () => {
    const [addressId, setAddressId] = useState<string | null>(null);
    const { cartPrdcts, removeItemsFromCart, selectedAddressId } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const stripe = useStripe(); // Stripe hook'u
    const elements = useElements(); // Stripe hook'u
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null); // ClientSecret state'i
    const router = useRouter()
    const searchParams = useSearchParams();

    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Ödeme yapmak için giriş yapmalısınız");
            router.push('/login');
        }
    }, [status, router]);
    useEffect(() => {
        let total = 0;
        cartPrdcts?.forEach(prd => {
            total += Number(prd.price) * prd.quantity;
        });
        setTotalPrice(total);

        // Backend'den ClientSecret'i al
        const fetchClientSecret = async () => {
            const response = await fetch('/api/create-payment-intent', {  // API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalPrice }), // Toplam tutarı gönder
            });

            const data = await response.json();
            setClientSecret(data.clientSecret);  // ClientSecret'i state'e al
        };

        if (totalPrice > 0) {
            fetchClientSecret();  // ClientSecret'ı al
        }
    }, [cartPrdcts, totalPrice]);
    // Oturum ve adres durumlarını tek effect'te birleştirin
useEffect(() => {
    // Oturum kontrolü
    if (status === "unauthenticated") {
      toast.error("Ödeme yapmak için giriş yapmalısınız");
      router.push('/login');
      return;
    }
  
    // Adres kontrolü
    const urlAddressId = searchParams?.get('addressId');
    const localAddressId = localStorage.getItem('selectedAddressId');
    const finalAddressId = urlAddressId || localAddressId;
  
    if (!finalAddressId) {
      toast.error("Lütfen önce bir adres seçin");
      router.push('/cart');
      return;
    }
  
    setAddressId(finalAddressId);
    localStorage.setItem('selectedAddressId', finalAddressId);
  
  }, [status, router, searchParams]);
    useEffect(() => {
        const checkAddress = () => {

            const urlParams = new URLSearchParams(window.location.search);
            const urlAddressId = urlParams.get('addressId');
            const storedAddressId = localStorage.getItem('selectedAddressId');

            const finalAddressId = urlAddressId || storedAddressId;

            // 1. Adres kontrolü
            if (!finalAddressId) {
                toast.error("Lütfen önce bir adres seçin");
                router.push('/cart');
                return null;
            }
            return finalAddressId;
        }


        // 3. State'i güncelle
        const validAddressId = checkAddress();
        setAddressId(validAddressId);


    }, [router]);
    useEffect(() => {
        const totalHesapla = () => {
            let total = 0;
            cartPrdcts?.forEach(prd => {
                total += Number(prd.price) * prd.quantity;
            });
            setTotalPrice(total);
        };

        totalHesapla();
    }, [cartPrdcts]);
    useEffect(() => {
        const clientSecretAl = async () => {
            if (!totalPrice || !session?.user?.id || !selectedAddressId) return;

            try {
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: totalPrice,
                        userId: session.user.id,
                        addressId: selectedAddressId
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error);

                setClientSecret(data.clientSecret);
            } catch (error) {
                toast.error("Ödeme başlatılamadı");
            }
        };

        clientSecretAl();
    }, [totalPrice, session, selectedAddressId]);

    const handlePaymentSuccess = async (paymentData: PaymentData) => {
        // artık useCart.selectedAddressId yerine local state addressId’i kullanıyoruz
        if (!addressId || !userId) {
          toast.error("Eksik bilgi: Lütfen adres ve kullanıcı bilgilerini kontrol edin");
          return;
        }
      
        let items;
        try {
          items = typeof paymentData.items === 'string'
            ? JSON.parse(paymentData.items)
            : paymentData.items;
        } catch {
          toast.error("Geçersiz ürün verisi");
          return;
        }
      
        try {
          const response = await fetch('/api/addOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              addressId,
              userId,
              items: items.map((item: any) => ({
                productId: item.id,
                amount: item.quantity
              }))
            }),
          });
      
          if (!response.ok) throw new Error(await response.text());
      
          removeItemsFromCart();
          toast.success("Sipariş başarıyla oluşturuldu!");
          router.push("/account/orders");
        } catch (error: any) {
          console.error('🚨 Hata:', error);
          toast.error(error.message || "Sipariş oluşturulamadı");
        }
      };

    // ✅ Ödeme işlemi
    const handlePayment = async (event: React.FormEvent) => {
        try {
            if (!session?.user) {
                toast.error("Oturumunuz sona ermiş. Lütfen yeniden giriş yapın");
                return router.push('/login');
              }
            if (!addressId) {
                toast.error("Lütfen adres seçin");
                return router.push('/cart');
            }
            const addressFromURL = searchParams?.get('address');
            const addressFromStorage = localStorage.getItem('selectedAddressId');
            const finalAddress = addressFromURL || addressFromStorage;
            event.preventDefault();
            if (!finalAddress) {
                throw new Error("Adres bilgisi eksik");
            }
            if (!stripe || !elements || !userId || !clientSecret) {
                alert("Stripe yüklenemedi veya kullanıcı bilgisi eksik!");
                return;
            }

            setLoading(true);

            // Birleştirilmiş CardElement yerine, CardNumberElement kullanıyoruz
            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) {
                alert("Kart bilgileri eksik!");
                setLoading(false);
                return;
            }

            // Ödeme yöntemi oluşturuluyor
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
            });

            if (pmError) {
                alert(`Ödeme yöntemi oluşturulurken hata: ${pmError.message}`);
                setLoading(false);
                return;
            }

            // PaymentIntent'i onaylıyoruz
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                alert(`Ödeme hatası: ${confirmError.message}`);
                setLoading(false);
            } else if (paymentIntent?.status === 'succeeded') {
                alert('Ödeme başarılı!');
                const paymentData: PaymentData = {
                    userId,
                    items: JSON.stringify(cartPrdcts),
                    totalPrice,
                };
                await handlePaymentSuccess(paymentData);
                setLoading(false);
            }
        } catch (error) {
            console.error("Ödeme hatası:", error);
        }
    };


    return (
        <div className="h-screen flex flex-col gap-4  items-center justify-center">
            <div className="border-2 px-24 py-10 shadow-2xl border-gray-400 rounded-lg p-6">
                <h1 className="text-3xl text-black text-center mb-4">Ödeme Formu</h1>

                {paymentSuccess ? (
                    <p className="text-green-600 text-xl font-bold text-center">✅ Siparişiniz başarıyla tamamlandı!</p>
                ) : (
                    <div className="flex flex-col w-96 gap-3">
                        <div>
                            <label className="block mb-1">Kart Numarası</label>
                            <CardNumberElement
                                className="px-3 py-3 rounded-lg border-2 w-full"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': { color: '#aab7c4' },
                                        },
                                        invalid: { color: '#9e2146' },
                                    },
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Son Kullanma Tarihi</label>
                            <CardExpiryElement
                                className="px-3 py-3 rounded-lg border-2 w-full"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': { color: '#aab7c4' },
                                        },
                                        invalid: { color: '#9e2146' },
                                    },
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-1">CVC</label>
                            <CardCvcElement
                                className="px-3 py-3 rounded-lg border-2 w-full"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': { color: '#aab7c4' },
                                        },
                                        invalid: { color: '#9e2146' },
                                    },
                                }}
                            />
                        </div>

                        <button
                            className="bg-renk1 mt-2 text-white py-3 rounded-xl"
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            ₺ {totalPrice > 1000 ? `${priceClip(totalPrice)}` : `${priceClip(totalPrice)} + 39`} Öde
                        </button>
                        <div className="flex items-center">
                            <span>
                                <img width={61} className="rounded-xl px-2 p-2" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="" />
                            </span>
                            <span>
                                <img width={61} className="rounded-xl px-2 p-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="" />
                            </span>
                            <span>
                                <img width={61} className="rounded-xl px-2 p-2" src="https://www.svgrepo.com/show/328122/paypal.svg" alt="" />
                            </span>
                        </div>
                    </div>



                )}
            </div>
        </div>
    );
};

export default formPayment;