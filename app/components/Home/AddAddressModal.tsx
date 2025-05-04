// app/components/Home/AddAddressModal.tsx
"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AddAddressModalProps {
  onClose: () => void;
  onSave: (data: {
    title: string;
    city: string;
    address: string;
    postalCode: string;
  }) => Promise<void> | void;
  cities: string[];
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSave,
  cities,
}) => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [addr, setAddr] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title || !city || !addr || !postalCode) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
    await onSave({ title, city, address: addr, postalCode });
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Yeni Adres Ekle</h2>

        <input
          type="text"
          placeholder="Adres Başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2 mb-3"
        />

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded w-full p-2 mb-3"
        >
          <option value="">Şehir Seçin</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Adres"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          className="border rounded w-full p-2 mb-3 h-24"
        />

        <input
          type="text"
          placeholder="Posta Kodu"
          value={postalCode}
          maxLength={5}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setPostalCode(v);
            if (!/^\d*$/.test(v)) setError("Yalnızca rakam girin");
            else setError("");
          }}
          className="border rounded w-full p-2 mb-2"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-renk1 rounded-md "
          >
            Vazgeç
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
