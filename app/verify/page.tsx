"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const router = useRouter();
  const [message, setMessage] = useState("E-posta doğrulanıyor...");

  useEffect(() => {
    if (!token) {
      setMessage("Geçersiz doğrulama bağlantısı.");
      return;
    }

    // API'ye doğrulama isteği gönder
    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/verifyEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("E-posta başarıyla doğrulandı! Ana sayfaya yönlendiriliyorsunuz...");
          setTimeout(() => {
            router.push("/"); // Başarılı doğrulama sonrası ana sayfaya yönlendir
          }, 3000);
        } else {
          setMessage(data.error || "Doğrulama başarısız oldu.");
        }
      } catch (error) {
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-lg font-semibold">{message}</h2>
    </div>
  );
};

export default VerifyPage;
