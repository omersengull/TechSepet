"use client";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

import AuthContainer from "../containers/AuthContainer";
import Heading from "../General/Heading";
import Input from "../General/Input";
import Button from "../General/Button";

interface AuthProps {
  currentUser: User | null | undefined;
}

const Auth: React.FC<AuthProps> = ({ currentUser }) => {
  // Kayıt Ol <-> Giriş Yap arayüzünü belirler
  const [isSignUp, setIsSignUp] = useState(false);

  // Arka planın kırmızıya dönüşmesi
  const [expandRed, setExpandRed] = useState(false);

  // Butonların disable (yükleniyor) durumu
  const [isLoading, setIsLoading] = useState(false);

  // İçerik görünür/gizli durumu (formlar ve metinler)
  const [isVisible, setIsVisible] = useState(true);

  const router = useRouter();

  // react-hook-form ayarları
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>();

  /**
   * Kayıt Ol <-> Giriş Yap geçişi
   * 1) Kutuyu kırmızıya boyar, içerikleri gizler
   * 2) 800ms sonra kutu beyaza döner, arayüz değişir
   * 3) 100ms sonra yeni içerikler görünür
   */
  const toggle = () => {
    // 1) Kırmızıya geç ve içerikleri gizle
    setExpandRed(true);
    setIsVisible(false);

    // 2) 800ms sonra arayüzü değiştir ve kırmızıyı kapat
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setExpandRed(false);

      // 3) 100ms sonra yeni içerikleri göster
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 800);
  };

  // Giriş Yap (Credentials)
  const handleLogin: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (callback?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("Giriş yapma başarılı!");
        reset();
      } else if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error) {
      console.error("Giriş sırasında hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Kayıt Ol
  const handleRegister: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("/api/register", data);
      toast.success("Kullanıcı Oluşturuldu!");

      const callback = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (callback?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("Giriş yapma başarılı!");
        reset();
      } else if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google ile Giriş/Kayıt
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google").catch((error) => {
      console.error("Google ile giriş sırasında hata:", error);
      toast.error("Google ile giriş sırasında bir hata oluştu.");
      setIsLoading(false);
    });
  };

  // Eğer kullanıcı zaten giriş yapmışsa otomatik /cart sayfasına yönlendir
  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);

  return (
    <AuthContainer>
      <div className="h-screen flex justify-center items-center">
        {/**
         * Ana Kutu
         * - Arka plan 800ms içinde kırmızıya döner (expandRed = true)
         * - transition-all ile yumuşak geçiş
         */}
        <div
          className={`relative w-[1050px] min-h-[550px] flex shadow-lg rounded-md 
            transition-all duration-[800ms] ease-in-out 
            ${expandRed ? "bg-renk1" : "bg-white"}`}
        >
          {/**
           * 1) isSignUp = true ve içerik görünürken "Tekrar Hoş Geldiniz" alanı
           */}
          {isSignUp && isVisible && (
            <div className="w-1/2 bg-renk1 text-white flex flex-col justify-center items-center p-6 relative z-10 rounded-r-[2000px]">
              <h1 className="text-3xl font-bold">Tekrar Hoş Geldiniz!</h1>
              <p className="mt-2 text-sm">Zaten Bir Hesabınız Var Mı?</p>
              <button
                onClick={toggle}
                disabled={isLoading}
                className="mt-4 px-4 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-red-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Giriş Yapın
              </button>
            </div>
          )}

          {/**
           * 2) Form Alanı
           * - Hem Giriş Yap hem de Kayıt Ol formu
           * - Sadece isVisible = true iken görünür
           */}
          {isVisible && (
            <div className="w-1/2 py-8 px-6">
              <Heading text={isSignUp ? "Kayıt Ol" : "Giriş Yap"} center={true} />
              <form
                onSubmit={
                  isSignUp
                    ? handleSubmit(handleRegister)
                    : handleSubmit(handleLogin)
                }
              >
                {/* Kayıt Ol Elemanları */}
                {isSignUp && (
                  <>
                    <Input
                      placeholder="Ad"
                      type="text"
                      id="name"
                      register={register}
                      errors={errors}
                      required
                    />
                    <Input
                      placeholder="Soyad"
                      type="text"
                      id="surname"
                      register={register}
                      errors={errors}
                      required
                    />
                  </>
                )}

                {/* Ortak Elemanlar (Email & Password) */}
                <Input
                  placeholder="E-Posta"
                  type="email"
                  id="email"
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  placeholder="Parola"
                  type="password"
                  id="password"
                  register={register}
                  errors={errors}
                  required
                />

                {/* Giriş Yap'a özel elemanlar */}
                {!isSignUp && (
                  <div onClick={()=>{router.push('/forgotPassword')}} className="text-right text-xs text-gray-600 mb-2">
                    <button
                      type="button"
                      className="hover:underline focus:outline-none"
                    >
                      Şifrenizi mi unuttunuz?
                    </button>
                  </div>
                )}

                <Button
                  text={isSignUp ? "Kayıt Ol" : "Giriş Yap"}
                  onClick={
                    isSignUp
                      ? handleSubmit(handleRegister)
                      : handleSubmit(handleLogin)
                  }
                  disabled={isLoading}
                />
              </form>

              {/* Google ile Giriş/Kayıt */}
              <div className="text-center my-2 text-gray-500">Ya da</div>
              <Button
                text={isSignUp ? "Google ile Kayıt Ol" : "Google ile Giriş Yap"}
                icon={FcGoogle}
                outline
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              />
            </div>
          )}

          {/**
           * 3) isSignUp = false ve içerik görünürken "Hoş Geldiniz" alanı
           */}
          {!isSignUp && isVisible && (
            <div className="w-1/2 bg-renk1 text-white flex flex-col justify-center items-center p-6 relative z-10 rounded-l-[2000px]">
              <h1 className="text-3xl font-bold">Hoş Geldiniz!</h1>
              <p className="mt-2 text-sm">Hesabınız yok mu?</p>
              <button
                onClick={toggle}
                disabled={isLoading}
                className="mt-4 px-4 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-red-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Kayıt Olun
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthContainer>
  );
};

export default Auth;
