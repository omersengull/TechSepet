"use client";
import Logo from "./Logo";
import User from "./User";
import ShoppingCart from "./ShoppingCart";
import Search from "./Search";
import { useRouter } from "next/navigation";
import Category from "../Home/Category";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { useState, useEffect } from "react";
import { useSpinner } from "@/app/spinner/SpinnerContext";
import Spinner from "@/app/spinner/Spinner";
import React from "react"
interface AppUser {
    createdAt: Date;
    updatedAt: Date;
    emailVerified: Date | null;
    image: string | null;
    id: string;
    email: string;
    hashedPassword: string | null;
    name: string | null;
    role: string;
    gender: string | null;
    surname: string | null;
    phone: string | null;
    birthday: Date | null;
    addresses: string | null;
}




const Navbar = () => {
    const { setIsLoading, isLoading } = useSpinner();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null); // currentUser'ı User veya null olarak ayarladık

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                const transformedUser: AppUser = {
                    ...user,
                    hashedPassword:null, // Varsayılan değer null
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt),
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                    gender: user.gender || null,
                    surname: user.surname || null,
                    phone: user.phone || null,
                    birthday: user.birthday ? new Date(user.birthday) : null,
                    addresses: user.addresses || null,
                };
                setCurrentUser(transformedUser);
            } else {
                setCurrentUser(null);
            }
        };
    
        fetchUser();
    }, []);
    
    const handleRouteCart = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false); // Yükleme tamamlandığında spinner'ı durdur
            router.push("/cart");
        }, 2000);
    };

    const handleRouteMain = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false); // Yükleme tamamlandığında spinner'ı durdur
            router.push("/");
        }, 2000);
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50 bg-black">
                    <Spinner /> {/* Spinner bileşenini burada render et */}
                </div>
            )}
            <div className="flex flex-col bg-renk1 h-auto px-4 lg:px-16 text-white">
                <div className="flex flex-row h-[80px] justify-between items-center gap-3">

                    <div className="flex flex-row items-center gap-3">
                        <div className="mr-3 lg:mr-7 cursor-pointer" onClick={() => handleRouteMain()}>
                            <Logo />
                        </div>
                        
                    </div>

                    <div className="hidden sm:block">
                        <Search />
                    </div>

                    <div className="flex flex-row items-center gap-3">
                        <div className="md:mr-3">
                            <User currentUser={currentUser} />
                        </div>
                        <div className="mr-3" onClick={handleRouteCart}>
                            <ShoppingCart />
                        </div>
                    </div>
                </div>

                <div className="sm:hidden mb-6">
                    <Search />
                </div>
            </div>
            <div>
            <Category />
            </div>
        </>
    );
};

export default Navbar;
