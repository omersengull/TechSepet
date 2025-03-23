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
import Input from "../General/Input";
import AuthContainer from "../containers/AuthContainer";
import Button from "../General/Button";

interface AuthProps {
  currentUser: User | null | undefined;
}

const Auth: React.FC<AuthProps> = ({ currentUser }) => {
  const [isActive, setIsActive] = useState(false);
  const [loadingType, setLoadingType] = useState<"credentials" | "google" | null>(null);

  const router = useRouter();



  /**
   * Kayıt Ol
   */
  const handleRegister: SubmitHandler<FieldValues> = async (data) => {
    setLoadingType("credentials");
    try {
      // Make sure we're sending all required fields properly
      const registrationData = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
      };

      // Log the data being sent (for development/debugging)
      console.log("Sending registration data:", registrationData);

      // Send the registration request
      const response = await axios.post("/api/register", registrationData);

      // Check if the registration was successful
      if (response.data) {
        toast.success("Kullanıcı Oluşturuldu!");

        // Kayıt sonrası otomatik giriş
        const callback = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (callback?.ok) {
          router.push("/cart");
          router.refresh();
          toast.success("Giriş yapma başarılı!");
          resetRegister();
        } else if (callback?.error) {
          toast.error(callback.error);
        }
      }
    } catch (error: any) {
      // Improved error handling with more specific messages
      console.error("Kayıt sırasında hata oluştu:", error);

      // Display specific error message from API if available
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Kayıt hatası: ${error.response.data.error}`);
      } else {
        toast.error("Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoadingType(null);
    }
  };

  /**
   * Giriş Yap
   */
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);
  const handleLogin: SubmitHandler<FieldValues> = async (data) => {
    setLoadingType("credentials");
    try {
      const callback = await signIn("credentials", {
        email: data.emailLogin,
        password: data.passwordLogin,
        redirect: false,
      });

      if (callback?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("Giriş yapma başarılı!");
        resetLogin();
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

  /**
   * Google ile Giriş/Kayıt
   */
  const handleGoogleSignIn = () => {
    setLoadingType("google");
    signIn("google").catch((error) => {
      console.error("Google ile giriş sırasında hata:", error);
      toast.error("Google ile giriş sırasında bir hata oluştu.");
      setLoadingType(null);
    });
  };
  const [registerScreen,setRegisterScreen]=useState(false);
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: errorsLogin },
  } = useForm<FieldValues>();

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    reset: resetRegister,
    formState: { errors: errorsRegister },
  } = useForm<FieldValues>();
  /**
   * Eğer kullanıcı zaten giriş yapmışsa, cart sayfasına yönlendir
   */
  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);

  return (
    <AuthContainer>
      {isMobile ? (
        // 📱 Mobil görünüm
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            {registerScreen ? (
              // Kayıt Ol ekranı
              <>
                <h1 className="text-center text-2xl font-bold mb-4">Hesap Oluştur</h1>
                <form onSubmit={handleSubmitRegister(handleRegister)}>
                  <Input
                    id="name"
                    type="text"
                    placeholder="İsim"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Soyad"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-Posta"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Parola"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-renk1 text-white py-2 rounded mt-4 flex justify-center items-center"
                    disabled={loadingType !== null}
                  >
                    {loadingType === "credentials" ? (
                      <>
                        <HashLoader size={20} color="#ffffff" />
                        <span className="ml-2">İşleniyor...</span>
                      </>
                    ) : (
                      "Kayıt Ol"
                    )}
                  </button>
                  <div className="mt-6">
                    <Button
                      icon={FcGoogle}
                      outline
                      onClick={handleGoogleSignIn}
                      disabled={loadingType !== null}
                    >
                      <span className="text-black ml-1">Google ile Kayıt Ol</span>
                      {loadingType === "google" && (
                        <span className="ml-2">
                          <HashLoader size={20} color="#3489eb" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
                <hr />
                <div className="mt-3 flex justify-center">
                  Hesabınız var mı?{" "}
                  <a
                    className="ml-1 text-blue-600 cursor-pointer"
                    onClick={() => setRegisterScreen(false)}
                  >
                    Giriş Yapın
                  </a>
                </div>
              </>
            ) : (
              // Giriş Yap ekranı
              <>
                <h1 className="text-center text-2xl font-bold mb-4">Giriş Yap</h1>
                <form onSubmit={handleSubmitLogin(handleLogin)}>
                  <Input
                    id="emailLogin"
                    type="email"
                    placeholder="E-Posta"
                    register={registerLogin}
                    errors={errorsLogin}
                    required
                  />
                  <Input
                    id="passwordLogin"
                    type="password"
                    placeholder="Parola"
                    register={registerLogin}
                    errors={errorsLogin}
                    required
                  />
                  <a
                    href="/forgotPassword"
                    className="text-sm text-blue-600 mt-2 block"
                  >
                    Şifrenizi mi unuttunuz?
                  </a>
                  <button
                    type="submit"
                    className="w-full bg-renk1 text-white py-2 rounded mt-4 flex justify-center items-center"
                    disabled={loadingType !== null}
                  >
                    {loadingType === "credentials" ? (
                      <>
                        <HashLoader size={20} color="#ffffff" />
                        <span className="ml-2">İşleniyor...</span>
                      </>
                    ) : (
                      "Giriş Yap"
                    )}
                  </button>
                  <div className="mt-6">
                    <Button
                      icon={FcGoogle}
                      outline
                      onClick={handleGoogleSignIn}
                      disabled={loadingType !== null}
                    >
                      <span className="text-black ml-1">Google ile Giriş Yap</span>
                      {loadingType === "google" && (
                        <span className="ml-2">
                          <HashLoader size={20} color="#3489eb" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
                <hr />
                <div className="mt-3 flex justify-center">
                  Hesabınız Yok Mu?{" "}
                  <a
                    className="ml-1 text-blue-600 cursor-pointer"
                    onClick={() => setRegisterScreen(true)}
                  >
                    Kayıt Olun
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // 💻 Masaüstü görünüm
        <>
          <div className="bgimg min-h-screen w-full flex justify-center items-center px-4 py-8 overflow-y-auto">
            <div
              className={`container1 ${isActive ? "active" : ""}`}
              id="container1"
              style={{ width: "1000px", height: "500px" }}
            >
              {/* Giriş Yap Formu */}
              <div className="form-container sign-in">
                <form
                  id="signinform"
                  autoComplete="true"
                  onSubmit={handleSubmitLogin(handleLogin)}
                >
                  <h1>Giriş Yap</h1>
                  <Input
                    id="emailLogin"
                    type="email"
                    placeholder="E-Posta"
                    register={registerLogin}
                    errors={errorsLogin}
                    required
                  />
                  <Input
                    id="passwordLogin"
                    type="password"
                    placeholder="Parola"
                    register={registerLogin}
                    errors={errorsLogin}
                    required
                  />
                  <a href="/forgotPassword">Şifrenizi mi unuttunuz?</a>
                  <button
                    type="submit"
                    className="bg-renk1 mt-2"
                    disabled={loadingType !== null}
                  >
                    {loadingType === "credentials" ? (
                      <span className="flex items-center justify-center">
                        <HashLoader size={20} color="#ffffff" />
                        <span className="ml-2">İşleniyor...</span>
                      </span>
                    ) : (
                      "Giriş Yap"
                    )}
                  </button>
                  <span className="flex justify-center mt-2">Ya Da</span>
                  <span>
                    <Button
                      icon={FcGoogle}
                      outline
                      onClick={handleGoogleSignIn}
                      disabled={loadingType !== null}
                    >
                      <span className="text-black ml-1">Google İle Giriş Yap</span>
                      {loadingType === "google" && (
                        <span className="ml-2">
                          <HashLoader size={20} color="#3489eb" />
                        </span>
                      )}
                    </Button>
                  </span>
                </form>
              </div>

              {/* Kayıt Ol Formu */}
              <div className="form-container sign-up">
                <form id="signupform" onSubmit={handleSubmitRegister(handleRegister)}>
                  <h1>Hesap Oluştur</h1>
                  <Input
                    id="name"
                    type="text"
                    placeholder="İsim"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Soyad"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-Posta"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Parola"
                    register={registerRegister}
                    errors={errorsRegister}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-renk1"
                    disabled={loadingType !== null}
                  >
                    {loadingType === "credentials" ? (
                      <span className="flex items-center justify-center">
                        <HashLoader size={20} color="#ffffff" />
                        <span className="ml-2">İşleniyor...</span>
                      </span>
                    ) : (
                      "Kayıt Ol"
                    )}
                  </button>
                  <span className="flex justify-center mt-2">Ya Da</span>
                  <span>
                    <Button
                      icon={FcGoogle}
                      outline
                      onClick={handleGoogleSignIn}
                      disabled={loadingType !== null}
                    >
                      <span className="text-black ml-1">Google İle Kayıt Ol</span>
                      {loadingType === "google" && (
                        <span className="ml-2">
                          <HashLoader size={20} color="#3489eb" />
                        </span>
                      )}
                    </Button>
                  </span>
                </form>
              </div>

              {/* Sağ/Sol Panel Geçişleri */}
              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h1>
                      <b>Tekrar Hoş Geldiniz!</b>
                    </h1>
                    <p>Zaten bir hesabınız var mı? Hemen giriş yapın!</p>
                    <button
                      className="border border-white"
                      onClick={() => setIsActive(false)}
                      id="login"
                    >
                      Giriş Yap
                    </button>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h1>
                      <b>Hoş Geldiniz!</b>
                    </h1>
                    <p>Hesabınız yok mu? Hemen bir tane oluşturun!</p>
                    <button
                      className="border border-white"
                      onClick={() => setIsActive(true)}
                      id="register"
                    >
                      Kayıt Ol
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthContainer>
  );
};

export default Auth;