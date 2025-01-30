"use client"
import React from 'react'
import FormPayment from '@/app/formPayment'
import { SessionProvider } from 'next-auth/react'
const page = () => {
    return (
        <SessionProvider>
        <FormPayment />
        </SessionProvider>
    )
}

export default page