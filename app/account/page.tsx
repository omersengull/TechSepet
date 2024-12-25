"use client";
import React from "react"; // React'ı ekledik
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { getCurrentUser } from "../actions/getCurrentUser";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";

const Page = ({ currentUser }: { currentUser: User | null }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(currentUser);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setUser({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          hashedPassword: "",
        });
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Çıkış sırasında bir hata oluştu:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-start">
      <h2 className="mt-3 font-bold text-xl">
        Hoş geldiniz {currentUser?.name} {currentUser?.surname}
      </h2>
      <div className="mt-5 space-y-3 w-full max-w-md">
        <div
          onClick={() => router.push("/account/personalinformation")}
          className="mb-3 flex items-center justify-between border-2 px-5 py-2 rounded-xl cursor-pointer"
        >
          <span>Kişisel bilgiler</span>
          <MdArrowForwardIos />
        </div>
        <div
          onClick={() => router.push("/account/orders")}
          className="mb-5 flex items-center justify-between border-2 px-5 py-2 rounded-xl cursor-pointer"
        >
          <span>Siparişlerim</span>
          <MdArrowForwardIos />
        </div>
        <div
          onClick={() => router.push("/account/addresses")}
          className="mb-5 flex items-center justify-between border-2 px-5 py-2 rounded-xl cursor-pointer"
        >
          <span>Adreslerim</span>
          <MdArrowForwardIos />
        </div>
        <div
          onClick={() => handleSignOut()}
          className="mb-5 flex items-center justify-between border-2 px-5 py-2 rounded-xl cursor-pointer"
        >
          <span>Çıkış Yap</span>
          <MdArrowForwardIos />
        </div>
      </div>
    </div>
  );
};

export default Page;
