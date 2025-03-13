"use client";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { HashLoader } from "react-spinners";

import AuthContainer from "../containers/AuthContainer";
import Heading from "../General/Heading";
import Input from "../General/Input";
import Button from "../General/Button";

interface AuthProps {
  currentUser: User | null | undefined;
}

const Auth: React.FC<AuthProps> = ({ currentUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [expandRed, setExpandRed] = useState(false);
  // loadingType: "credentials" | "google" | null
  const [loadingType, setLoadingType] = useState<"credentials" | "google" | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>();

  /**
   * Kayıt Ol <-> Giriş Yap geçişi
   */
  const toggle = () => {
    setExpandRed(true);
    setIsVisible(false);

    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setExpandRed(false);

      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 800);
  };

  // Giriş Yap (Credentials)
  const handleLogin: SubmitHandler<FieldValues> = async (data) => {
    setLoadingType("credentials");
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
      setLoadingType(null);
    }
  };

  // Kayıt Ol
  const handleRegister: SubmitHandler<FieldValues> = async (data) => {
    setLoadingType("credentials");
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
      setLoadingType(null);
    }
  };

  // Google ile Giriş/Kayıt
  const handleGoogleSignIn = () => {
    setLoadingType("google");
    signIn("google").catch((error) => {
      console.error("Google ile giriş sırasında hata:", error);
      toast.error("Google ile giriş sırasında bir hata oluştu.");
      setLoadingType(null);
    });
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);

  return (
    <AuthContainer>
      <div className="min-h-screen w-full flex justify-center items-center px-4 py-8 overflow-y-auto">
        <div
          className={`
            relative w-full max-w-[1050px] min-h-[550px] flex flex-col md:flex-row
            shadow-2xl rounded-md overflow-hidden
            transform-gpu ring-2 ring-red-300/50
            transition-all duration-[800ms] ease-in-out 
            ${expandRed ? "bg-renk1 scale-102" : "bg-white scale-100"}
          `}
        >
          {isSignUp && isVisible && (
            <div
              className={`
                w-full md:w-1/2 bg-renk1 text-white 
                flex flex-col justify-center items-center p-6 
                relative z-10 md:rounded-r-[2000px]
                transition-all duration-700 ease-in-out
              `}
            >
              <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg text-center">
                Tekrar Hoş Geldiniz!
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/90 text-center">
                Zaten Bir Hesabınız Var Mı?
              </p>
              <button
                onClick={toggle}
                disabled={loadingType !== null}
                className="mt-5 px-5 py-2 border-2 border-white text-white rounded-md 
                  hover:bg-white hover:text-red-500 hover:scale-105 active:scale-95 
                  transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Giriş Yapın
              </button>
            </div>
          )}

          {isVisible && (
            <div
              className={`
                w-full md:w-1/2 py-8 px-6 
                transition-opacity duration-500 ease-in-out
                ${!expandRed ? "opacity-100" : "opacity-90"}
              `}
            >
              <Heading text={isSignUp ? "Kayıt Ol" : "Giriş Yap"} center={true} />
              <form
                onSubmit={
                  isSignUp
                    ? handleSubmit(handleRegister)
                    : handleSubmit(handleLogin)
                }
                className="space-y-4 mt-6"
              >
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

                {!isSignUp && (
                  <div
                    onClick={() => {
                      router.push("/forgotPassword");
                    }}
                    className="text-right text-xs text-gray-500 mb-2 cursor-pointer"
                  >
                    <button
                      type="button"
                      className="hover:underline focus:outline-none"
                    >
                      Şifrenizi mi unuttunuz?
                    </button>
                  </div>
                )}

                {/* Credentials Butonu */}
                <Button
                  onClick={
                    isSignUp
                      ? handleSubmit(handleRegister)
                      : handleSubmit(handleLogin)
                  }
                  disabled={loadingType !== null}
                >
                  <span>{isSignUp ? "Kayıt Ol" : "Giriş Yap"}</span>
                  {loadingType === "credentials" && (
                    <span className="ml-2">
                      <HashLoader size={20} color="#3489eb" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center my-4 text-gray-400">Ya da</div>
              <div className="flex items-center justify-center">
                <Button 
                  icon={FcGoogle}
                  outline
                  onClick={handleGoogleSignIn}
                  disabled={loadingType !== null}
                >
                  <span className="ml-1">
                    {isSignUp
                      ? "Google ile Kayıt Ol"
                      : "Google ile Giriş Yap"}
                  </span>
                  {loadingType === "google" && (
                    <span className="ml-2">
                      <HashLoader size={20} color="#3489eb" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {!isSignUp && isVisible && (
            <div
              className={`
                w-full md:w-1/2 bg-renk1 text-white 
                flex flex-col justify-center items-center p-6 
                relative z-10 md:rounded-l-[2000px]
                transition-all duration-700 ease-in-out 
              `}
            >
              <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg text-center">
                Hoş Geldiniz!
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/90 text-center">
                Hesabınız yok mu?
              </p>
              <button
                onClick={toggle}
                disabled={loadingType !== null}
                className="mt-5 px-5 py-2 border-2 border-white text-white rounded-md 
                  hover:bg-white hover:text-red-500 hover:scale-105 active:scale-95 
                  transition disabled:opacity-70 disabled:cursor-not-allowed"
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
