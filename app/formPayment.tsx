'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCreditCard } from "react-icons/fa6";
import useCart from './hooks/useCart';
import priceClip from './utils/priceClip';
const FormPayment = () => {
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
        
        const paymentCard = {
            cardHolderName: holderName,
            cardNumber: cardNumber,
            expireMonth: expireMonth,
            expireYear: expireYear,
            cvc: cvc,
            registerCard: '0'
        };

        const buyer = {
            id: 'BY789',
            name: 'Ömer',
            surname: 'Şengül',
            gsmNumber: '+905350000000',
            email: 'john.doe@example.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        };

        const shippingAddress = {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        };

        const billingAddress = {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        };

        const basketItems = [
            {
                id: 'BI101',
                name: 'Binocular',
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: 'PHYSICAL',
                price: `${totalPrice}`
            }
        ];

        const paymentData = {
            price: totalPrice.toFixed(2), 
            paidPrice: totalPrice.toFixed(2),
            currency: 'TRY',
            basketId: 'B67832',
            paymentCard: paymentCard,
            buyer: buyer,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            basketItems: basketItems
        };

        try {
            const response = await axios.post('http://localhost:3001/api/payment', paymentData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

             setResponse(response.data);
            if (response.data?.status=='success') {
               
                alert(`Ödeme işlemi başarılı!, ${response.data.status || 'Teşekkürler!'}`);
            } else {
                alert(`Ödeme işlemi başarısız. ${response.data.status || 'Eksik veya hatalı bilgiler.'}`);
            }
        
        } catch (error) {
            console.error('Error:', error);
            alert(error);
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
                        ₺ {totalPrice>1000 ? `${priceClip(totalPrice)}` : `${priceClip(totalPrice)} + 39`} Öde
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormPayment;
