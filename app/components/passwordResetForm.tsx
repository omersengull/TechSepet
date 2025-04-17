"use client";
import React, { useState } from "react";

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
      } else {
        setMessage(result.error || "Bir hata oluştu, tekrar deneyin.");
      }
    } catch (error) {
      setMessage("Bağlantı hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full my-20 max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Şifre Yenile</h2>
      <form onSubmit={handleReset}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            E-Posta Adresi
          </label>
          <input
            id="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="ornek@eposta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-renk1  text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isLoading ? "Gönderiliyor..." : "Şifre Yenile Bağlantısı Gönder"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default PasswordResetForm;
