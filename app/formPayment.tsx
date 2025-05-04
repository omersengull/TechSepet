'use client';

import React, { useState, useEffect } from 'react';
import { FaCreditCard } from "react-icons/fa";
import useCart from './hooks/useCart';
import priceClip from './utils/priceClip';
import { useSession } from "next-auth/react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingScreen from './components/LoadingScreen';

type PaymentData = {
    userId: string;
    items: string;
    totalPrice: number;
};

// Use dynamic import with ssr: false for the entire component
const FormPayment = () => {
    const { data: session, status } = useSession();
    const [isMounted, setIsMounted] = useState(false);
    const [sessionStatus, setSessionStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const [addressId, setAddressId] = useState<string | null>(null);
    const { cartPrdcts, removeItemsFromCart, selectedAddressId } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = session?.user?.id;

    // First useEffect - Handle component mounting
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Second useEffect - Handle session status
    useEffect(() => {
        if (status === "loading") {
            setSessionStatus("loading");
        } else if (status === "authenticated") {
            setSessionStatus("authenticated");
            console.log("Oturum yüklendi!", { duration: 2000 });
        } else {
            setSessionStatus("unauthenticated");
            router.push('/login');
        }
    }, [status, router]);

    // Third useEffect - Calculate total price
    useEffect(() => {
        if (!isMounted) return;

        const totalHesapla = () => {
            let total = 0;
            cartPrdcts?.forEach(prd => {
                total += Number(prd.price) * prd.quantity;
            });
            setTotalPrice(total);
        };

        totalHesapla();
    }, [cartPrdcts, isMounted]);

    // Fourth useEffect - Check address from URL or localStorage
    useEffect(() => {
        if (!isMounted) return;

        const checkAddress = () => {
            const urlAddressId = searchParams?.get('addressId');
            const storedAddressId = localStorage.getItem('selectedAddressId');
            const finalAddressId = urlAddressId || storedAddressId;

            if (!finalAddressId) {
                toast.error("Lütfen önce bir adres seçin");
                router.push('/cart');
                return null;
            }
            return finalAddressId;
        };

        const validAddressId = checkAddress();
        setAddressId(validAddressId);
    }, [router, searchParams, isMounted]);

    // Fifth useEffect - Get client secret for payment
    useEffect(() => {
        if (!isMounted || !totalPrice || !session?.user?.id || !selectedAddressId) return;

        const clientSecretAl = async () => {
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
    }, [totalPrice, session, selectedAddressId, isMounted]);

    const handlePaymentSuccess = async (paymentData: PaymentData) => {
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

    const handlePayment = async (event: React.FormEvent) => {
        try {
            event.preventDefault();

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

            if (!finalAddress) {
                throw new Error("Adres bilgisi eksik");
            }

            if (!stripe || !elements || !userId || !clientSecret) {
                alert("Stripe yüklenemedi veya kullanıcı bilgisi eksik!");
                return;
            }

            setLoading(true);

            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) {
                alert("Kart bilgileri eksik!");
                setLoading(false);
                return;
            }

            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
            });

            if (pmError) {
                alert(`Ödeme yöntemi oluşturulurken hata: ${pmError.message}`);
                setLoading(false);
                return;
            }

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
            setLoading(false);
        }
    };

    // Show loading screen during initial loading or when session is loading
    if (!isMounted || sessionStatus === "loading") {
        return <LoadingScreen />;
    }

    // Handle unauthenticated users
    if (sessionStatus === "unauthenticated") {
        return null; // Router already redirecting to login
    }

    return (
        <div className="h-screen flex flex-col gap-4 items-center justify-center">
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
                            Ödeme Yap
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

// Export as a client-side only component using dynamic import
export default dynamic(() => Promise.resolve(FormPayment), { ssr: false });