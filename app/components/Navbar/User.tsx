"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { User } from "@prisma/client";
import { useSpinner } from "@/app/spinner/SpinnerContext";
import { IoLogOut } from "react-icons/io5";
import { MdAccountBox, MdFavorite, MdOutlineContactPage } from "react-icons/md";
import { FaBox, FaLocationDot } from "react-icons/fa6";

interface UserProps {
  currentUser: User | null | undefined;
}

// Yeni SafeUser tipi, artık session verisinden gelen alanlara göre dolduruyoruz.
type SafeUser = Omit<User, 'hashedPassword' | 'name' | 'surname'> & {
  hashedPassword: string;
  name: string;
  surname: string;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  verificationToken: string | null;
  verificationTokenExpiry: Date | null;
  addresses: {
    address: string;
    title: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    city: string;
    postalCode: string;
    userId: string;
  }[];
};

const User: React.FC<UserProps> = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { setIsLoading } = useSpinner();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<SafeUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // useSession hook'u ile oturum durumundaki değişiklikleri dinliyoruz.
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // session.user.name bilgisini parçalayarak ad ve soyadı oluşturuyoruz
      const names = session.user.name?.split(" ") || ["Name", "Surname"];
      const transformedUser: SafeUser = {
        id: (session.user as any).id || "default-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        hashedPassword: "default-hash",
        gender: null,
        surname: names[1] || "Surname",
        phone: null,
        birthday: null,
        addresses: [],
        role: (session.user as any).role || "USER",
        name: names[0] || "Name",
        email: session.user.email || "example@gmail.com",
        image: session.user.image || null,
        resetToken: null,
        resetTokenExpiry: null,
        verificationToken: null,
        verificationTokenExpiry: null,
      };
      setUser(transformedUser);
    } else {
      setUser(null);
    }
  }, [status, session]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const menuFunc = (type: string) => {
    setOpenMenu(false);
    setIsLoading(true);
    setTimeout(async () => {
      if (type === "logout") {
        try {
          await signOut({ redirect: false });
          setUser(null);
          router.push("/");
        } catch (error) {
          console.error("Çıkış sırasında bir hata oluştu:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (type === "register") {
        router.push("/register");
        setIsLoading(false);
      } else if (type === "login") {
        router.push("/login");
        setIsLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    if (!user) {
      setOpenMenu(false);
    }
  }, [user]);

  return (
    <div className="md:flex relative z-40" ref={menuRef}>
      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="rounded-full cursor-pointer border border-white bg-white p-3"
      >
        {user?.role === "ADMIN" ? (
          <FaRegUser className="text-black m-1" />
        ) : user?.name && user?.surname ? (
          <div className="text-black font-bold">
            {user.name[0]?.toUpperCase()} {user.surname[0]?.toUpperCase()}
          </div>
        ) : (
          <FaRegUser className="text-black m-1" />
        )}
      </div>

      {isMobile && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
            openMenu ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setOpenMenu(false)}
        >
          <div
            className={`fixed top-0 right-0 w-3/4 max-w-[320px] h-full bg-white p-5 shadow-lg transform transition-transform ${
              openMenu ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-2xl text-gray-600"
              onClick={() => setOpenMenu(false)}
            >
              ✖️
            </button>
            <div className="mt-10 space-y-4 text-lg text-slate-700">
              {user ? (
                <>
                  <a href="/account" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                    <MdAccountBox className="mr-2" /> Hesabım
                  </a>
                  <a href="/account/personalinformation" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                    <MdOutlineContactPage className="mr-2" /> Kişisel Bilgiler
                  </a>
                  <a href="/account/orders" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                    <FaBox className="mr-2" /> Siparişlerim
                  </a>
                  <a href="/account/addresses" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                    <FaLocationDot className="mr-2" /> Adreslerim
                  </a>
                  <a href="/account/favorites" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                    <MdFavorite className="mr-2 text-red-500" /> Favori Ürünlerim
                  </a>
                  <hr className="my-2 border-gray-300" />
                  <div
                    onClick={() => menuFunc("logout")}
                    className="flex items-center text-red-600 hover:bg-red-100 px-3 py-2 rounded-md cursor-pointer"
                  >
                    <IoLogOut className="mr-2" /> Çıkış Yap
                  </div>
                </>
              ) : (
                <div
                  onClick={() => menuFunc("login")}
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer"
                >
                  <IoLogOut className="mr-2 text-green-600" /> Giriş Yap
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isMobile && openMenu && (
        <div className="absolute w-[250px] top-14 bg-white shadow-lg right-0 p-4 rounded-md border">
          <div className="space-y-2 text-slate-700">
            {user ? (
              <>
                <a href="/account" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                  <MdAccountBox className="mr-2" /> Hesabım
                </a>
                <a href="/account/personalinformation" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                  <MdOutlineContactPage className="mr-2" /> Kişisel Bilgiler
                </a>
                <a href="/account/orders" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                  <FaBox className="mr-2" /> Siparişlerim
                </a>
                <a href="/account/addresses" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                  <FaLocationDot className="mr-2" /> Adreslerim
                </a>
                <a href="/account/favorites" className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md">
                  <MdFavorite className="mr-2 text-red-500" /> Favori Ürünlerim
                </a>
                <hr className="my-2 border-gray-300" />
                <div
                  onClick={() => menuFunc("logout")}
                  className="flex items-center text-red-600 px-3 py-2 rounded-md cursor-pointer"
                >
                  <IoLogOut className="mr-2" /> Çıkış Yap
                </div>
              </>
            ) : (
              <div
                onClick={() => menuFunc("login")}
                className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer"
              >
                <IoLogOut className="mr-2 text-green-600" /> Giriş Yap
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
