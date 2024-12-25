"use client";
import React from "react"
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { signOut, getSession } from "next-auth/react";
import type { User } from "@prisma/client";
import { useSpinner } from "@/app/spinner/SpinnerContext";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

interface UserProps {
  currentUser: User | null | undefined;
}

const User: React.FC<UserProps> = ({ currentUser }) => {
  const { setIsLoading } = useSpinner();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<User | null | undefined>(currentUser);
  const menuRef = useRef<HTMLDivElement>(null); // Referans tanımlandı
  useEffect(() => {
    const updateUser = async () => {
      const session = await getSession();
      setUser(session?.user || null);
    };

    updateUser();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const menuFunc = (type: string) => {
    setOpenMenu(false); // Menü kapat
    setIsLoading(true); // Spinner başlat
    setTimeout(async () => {
      setIsLoading(false); // Spinner durdur
      if (type === "logout") {
        try {
          await signOut({ redirect: true });
          setUser(null); // Kullanıcı bilgisini sıfırla
          router.push('/');
        } catch (error) {
          console.error("Çıkış sırasında bir hata oluştu:", error);
        } finally {
          setIsLoading(false); // Spinner durdur
        }
      } else if (type === "register") {
        router.push("/register");
      } else if (type === "login") {
        router.push("/login");
      }
    }, 2000);

  };

  const handleRouteAdminOrAccount = (page: string) => {
    setOpenMenu(false); // Menü kapat
    setIsLoading(true); // Spinner başlat
    setTimeout(() => {
      setIsLoading(false); // Spinner durdur
      if (page === 'Admin') {
        router.push("/admin");
      } else if (page === 'Hesabım') {
        router.push("/account");
      }
    }, 2000);
  };
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!currentUser || !session) {
        setUser(null);
      }
    };

    checkSession();
  }, [currentUser]);
  useEffect(() => {
    if (!user) {
      setOpenMenu(false);
    }
  }, [user]);
  return (
    <div className="md:flex relative z-40" ref={menuRef}>
      <div
        onClick={() => setOpenMenu(!openMenu)}
        className={`rounded-full cursor-pointer border border-white bg-white p-3`}
      >
        {
          currentUser?.role === "ADMIN"
            ? (
              <FaRegUser className="text-black m-1" />
            )
            : currentUser?.name && currentUser?.surname
              ? (
                <div className="text-black font-bold">
                  {currentUser.name[0]?.toUpperCase()} {currentUser.surname[0]?.toUpperCase()}
                </div>
              )
              : (
                <FaRegUser className="text-black m-1" />
              )
        }
      </div>

      {openMenu && (
        <div className="absolute w-[200px] top-12 bg-white shadow-lg right-0 p-2 rounded-md">
          {user ? (
            <div className="space-y-1">
              <div
                className="text-slate-600 cursor-pointer"
              >
                {currentUser?.role == 'USER' ? <div onClick={() => handleRouteAdminOrAccount('Hesabım')}>Hesabım</div> : <div onClick={() => handleRouteAdminOrAccount('Admin')}>Admin</div>}
              </div>
              <div
                onClick={() => menuFunc("logout")}
                className="text-slate-600 cursor-pointer"
              >
                Çıkış
              </div>
            </div>
          ) : (
            <div>
              <div
                onClick={() => menuFunc("register")}
                className="text-slate-600 cursor-pointer"
              >
                Kayıt Ol
              </div>
              <div
                onClick={() => menuFunc("login")}
                className="text-slate-600 cursor-pointer"
              >
                Giriş Yap
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User;
