"use client"
import React from "react"
import { useRouter } from "next/navigation"

const Logo = () => {
    const router=useRouter()
    return (

        <div onClick={()=> router.push("/")} className="text-white font-raleway cursor-pointer"><span className="text-2xl sm:text-3xl">TechSepet</span> <span className="text-sm">.com</span></div>
    )
}

export default Logo