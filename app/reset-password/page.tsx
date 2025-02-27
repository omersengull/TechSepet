"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const NewPasswordForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // `useEffect` içinde searchParams kullanarak SSR hatasını önlüyoruz.
  useEffect(() => {
    setToken(searchParams?.get("token") ?? null); // ✅ Eğer undefined ise, null yap
  }, [searchParams]);
  

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !password) return;

    try {
      const response = await fetch("/api/set-new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Şifreniz başarıyla güncellendi.");
      } else {
        setMessage(result.error || "Bir hata oluştu.");
      }
    } catch (error) {
      setMessage("Bağlantı hatası oluştu.");
    }
  };

  return (
    <div className="w-full my-20 max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Yeni Şifre Belirle</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Yeni Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mt-4">
          Şifreyi Güncelle
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default NewPasswordForm;
