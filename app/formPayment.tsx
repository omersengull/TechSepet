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
            try {
                const urlAddressId = searchParams?.get('addressId');
                const storedAddressId = localStorage.getItem('selectedAddressId');
                const finalAddressId = urlAddressId || storedAddressId || selectedAddressId;
    
                if (!finalAddressId) {
                    console.log("Adres bilgisi bulunamadı");
                    // Don't immediately redirect, just record that address is missing
                    return null;
                }
                console.log("Adres ID bulundu:", finalAddressId);
                return finalAddressId;
            } catch (error) {
                console.error("Adres kontrolü sırasında hata:", error);
                return null;
            }
        };

        const validAddressId = checkAddress();
        if (validAddressId) {
            setAddressId(validAddressId);
        }
    }, [router, searchParams, isMounted, selectedAddressId]);

    // Fifth useEffect - Get client secret for payment
    useEffect(() => {
        if (!isMounted) return;
        if (!totalPrice) return;
        
        // Only proceed if we have cart products
        if (!cartPrdcts || cartPrdcts.length === 0) return;

        const clientSecretAl = async () => {
            try {
                // First try to get basic payment intent without user or address info
                // This ensures we get a client secret even if user is not fully authenticated yet
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: totalPrice,
                        // Send these if available but don't block if not
                        userId: session?.user?.id || '',
                        addressId: selectedAddressId || addressId || ''
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Ödeme başlatılamadı");

                if (data.clientSecret) {
                    console.log("Client Secret alındı");
                    setClientSecret(data.clientSecret);
                } else {
                    console.error("Client Secret alınamadı:", data);
                    toast.error("Ödeme başlatılamadı: Client Secret alınamadı");
                }
            } catch (error) {
                console.error("Payment intent hatası:", error);
                toast.error("Ödeme başlatılamadı");
            }
        };

        clientSecretAl();
    }, [totalPrice, isMounted, cartPrdcts, session?.user?.id, selectedAddressId, addressId]);

    const handlePaymentSuccess = async (paymentData: PaymentData) => {
        if (!paymentData.userId) {
            toast.error("Eksik bilgi: Kullanıcı kimliği bulunamadı");
            return;
        }
        
        // Get valid addressId from either state or props
        const finalAddressId = addressId || selectedAddressId;
        if (!finalAddressId) {
            toast.error("Eksik bilgi: Adres bilgisi bulunamadı");
            return;
        }

        let items;
        try {
            items = typeof paymentData.items === 'string'
                ? JSON.parse(paymentData.items)
                : paymentData.items;
        } catch (error) {
            console.error("Ürün verileri ayrıştırılamadı:", error);
            toast.error("Geçersiz ürün verisi");
            return;
        }

        try {
            const response = await fetch('/api/addOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: finalAddressId,
                    userId: paymentData.userId,
                    items: items.map((item: any) => ({
                        productId: item.id,
                        amount: item.quantity
                    }))
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            removeItemsFromCart();
            toast.success("Sipariş başarıyla oluşturuldu!");
            setPaymentSuccess(true);
            router.push("/account/orders");
        } catch (error: any) {
            console.error('🚨 Sipariş oluşturma hatası:', error);
            toast.error(error.message || "Sipariş oluşturulamadı");
        }
    };

    const handlePayment = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            
            // Check for stripe first - most important dependency
            if (!stripe || !elements) {
                console.error("Stripe veya Elements yüklenmedi");
                toast.error("Ödeme sistemi yüklenemedi, lütfen sayfayı yenileyin");
                return;
            }
            
            // Check for other dependencies
            if (!clientSecret) {
                console.error("Client Secret yok:", {clientSecret});
                toast.error("Ödeme başlatılamadı, lütfen sayfayı yenileyin");
                return;
            }
            
            // Now check user session
            if (!session?.user) {
                toast.error("Oturumunuz sona ermiş. Lütfen yeniden giriş yapın");
                return router.push('/login');
            }
            
            // Make sure we have a user ID
            const currentUserId = session.user.id;
            if (!currentUserId) {
                toast.error("Kullanıcı kimliği bulunamadı");
                return router.push('/login');
            }
    
            // Make sure we have an address
            if (!addressId) {
                const addressFromURL = searchParams?.get('address');
                const addressFromStorage = localStorage.getItem('selectedAddressId');
                const finalAddress = addressId || addressFromURL || addressFromStorage || selectedAddressId;
                
                if (!finalAddress) {
                    toast.error("Lütfen adres seçin");
                    return router.push('/cart');
                }
                
                setAddressId(finalAddress);
            }
    
            setLoading(true);
            console.log("Ödeme başlatılıyor...");
            
            try {
                // Get card element
                const cardNumberElement = elements.getElement(CardNumberElement);
                if (!cardNumberElement) {
                    toast.error("Kart bilgileri eksik!");
                    console.error("Card element bulunamadı");
                    setLoading(false);
                    return;
                }
                
                console.log("Ödeme yöntemi oluşturuluyor...");
                // Create payment method
                const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardNumberElement,
                });
    
                if (pmError) {
                    toast.error(`Ödeme yöntemi oluşturulurken hata: ${pmError.message}`);
                    console.error("Payment method hatası:", pmError);
                    setLoading(false);
                    return;
                }
                
                console.log("Ödeme onaylanıyor...");
                // Confirm payment
                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod.id,
                });
                
                if (confirmError) {
                    toast.error(`Ödeme hatası: ${confirmError.message}`);
                    console.error("Ödeme onaylama hatası:", confirmError);
                    setLoading(false);
                    return;
                } 
                
                if (paymentIntent?.status === 'succeeded') {
                    toast.success('Ödeme başarılı!');
                    console.log("Ödeme başarılı:", paymentIntent);
                    
                    // Ensure we have a valid userId
                    const safeUserId = session?.user?.id;
                    if (!safeUserId) {
                        toast.error("Kullanıcı kimliği bulunamadı, sipariş oluşturulamadı");
                        setLoading(false);
                        return;
                    }
                    
                    const paymentData: PaymentData = {
                        userId: safeUserId, // Fixed userId reference
                        items: JSON.stringify(cartPrdcts),
                        totalPrice,
                    };
                    await handlePaymentSuccess(paymentData);
                    setLoading(false);
                } else {
                    toast.error("Ödeme durum bilgisi alınamadı");
                    console.error("Beklenmeyen ödeme durumu:", paymentIntent?.status);
                    setLoading(false);
                }
            } catch (stripeError) {
                console.error("Stripe işlem hatası:", stripeError);
                toast.error("Ödeme işlemi sırasında hata oluştu");
                setLoading(false);
                return;
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