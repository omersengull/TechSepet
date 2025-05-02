"use client"
import React from "react"
import { useRouter } from "next/navigation"

const Logo = () => {
    const router=useRouter()
    return (

        <div onClick={()=> router.push("/")} className="text-white flex items-center font-raleway cursor-pointer">
            <img src="/imgs/logo.png"width={70} height={100} alt="Logo" /><span className="text-2xl sm:text-3xl">TechSepet</span></div>
    )
}

export default Logo