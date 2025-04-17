"use client"
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import FormPayment from '../formPayment'
const page = () => {
    
    const stripePromise = loadStripe("pk_test_51R68bCLFXUo4EH8bri3AyKUwFd21mcn2ecRjwP9Q0csZHeXZbA9dh5Mg77pkc17ypzrSBd5SX9OE24a1uaLGcvO100TpnRPk5N");
    return (
        <SessionProvider>
            <Elements stripe={stripePromise}>
            <FormPayment />
        </Elements>
        </SessionProvider >
    )
}

export default page