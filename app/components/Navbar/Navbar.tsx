    "use client";
    import Logo from "./Logo";
    import User from "./User";
    import ShoppingCart from "./ShoppingCart";
    import Search from "./Search";
    import { useRouter } from "next/navigation";
    import { getCurrentUser } from "@/app/actions/getCurrentUser";
    import { useState, useEffect } from "react";
    import { useSpinner } from "@/app/spinner/SpinnerContext";
    import Spinner from "@/app/spinner/Spinner";
    import React from "react";
    import type { User as PrismaUser } from "@prisma/client";
    import { MdManageSearch } from "react-icons/md";
    type SafeUser = {
        id: string;
        name: string;
        email: string;
        emailVerified: Date | null;
        image: any;
        hashedPassword: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        gender: string | null;
        surname: string;
        phone: string | null;
        birthday: Date | null;
    };

    const Navbar = () => {
        const { setIsLoading, isLoading } = useSpinner();
        const router = useRouter();
        const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

        useEffect(() => {
            const fetchUser = async () => {
                try {
                    const user = await getCurrentUser();
                    if (user) {
                        const transformedUser: SafeUser = {
                            id: user.id,
                            name: user.name || "Default Name",
                            email: user.email,
                            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                            image: user.image,
                            hashedPassword: user.hashedPassword,
                            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
                            updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
                            role: user.role || "USER",
                            gender: user.gender,
                            surname: user.surname || "Default Surname",
                            phone: user.phone,
                            birthday: user.birthday ? new Date(user.birthday) : null,
                        };
                        setCurrentUser(transformedUser);
                    } else {
                        setCurrentUser(null);
                    }
                } catch (error) {
                    console.error("Kullanıcı verileri alınırken bir hata oluştu:", error);
                    setCurrentUser(null);
                }
            };

            fetchUser();
        }, []);

        const handleRouteCart = () => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                router.push("/cart");
            }, 2000);
        };

        const handleRouteMain = () => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                router.push("/");
            }, 2000);
        };

        return (
            <>
                {isLoading && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50 bg-black">
                        <Spinner />
                    </div>
                )}
                <div className="flex flex-col bg-renk1 h-auto px-4 lg:px-16 text-white">
                    <div className="flex flex-row h-[80px] justify-between items-center gap-3">
                        <div className="flex flex-row items-center gap-3">
                            <div
                                className="mr-3 lg:mr-7 cursor-pointer"
                                onClick={handleRouteMain}
                            >
                                <Logo />
                            </div>
                        </div>

                        <div onClick={()=>{router.push('/dsearch')}} className="rounded-xl flex flex-row items-center cursor-pointer border-white border-2 md:px-6 px-4 md:py-3 sm:py-2 xs:py-1">
                            <MdManageSearch className="text-2xl mr-1"/> <span className="font-bold">Detaylı Arama</span>
                        </div>

                        <div className="hidden sm:block">
                            <Search />
                        </div>

                        <div className="flex flex-row items-center gap-3">
                            <div className="md:mr-3">
                                <User currentUser={currentUser} />
                            </div>
                            <div className="mr-3 cursor-pointer" onClick={handleRouteCart}>
                                <ShoppingCart />
                            </div>
                        </div>
                    </div>

                    <div className="sm:hidden mb-6">
                        <Search />
                    </div>
                </div>

            </>
        );
    };

    export default Navbar;