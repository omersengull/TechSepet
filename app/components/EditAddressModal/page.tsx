"use client"
import React, { useState, useEffect } from "react";
import { Address } from "@prisma/client";

interface EditAddressModalProps {
    address: Address;
    onClose: () => void;
    onSave: (updated: Address) => void;
    cities: string[];
}

const EditAddressModal = ({ address, onClose, onSave, cities }: EditAddressModalProps) => {
    const [title, setTitle] = useState(address.title);
    const [city, setCity] = useState(address.city);
    const [error, setError] = useState("");
    const [addr, setAddr] = useState(address.address);
    const [postalCode, setPostalCode] = useState(address.postalCode);

    const handleSubmit = () => {
        onSave({ ...address, title, city, address: addr, postalCode });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4 text-center"> Adresi Düzenle</h2>

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
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Sadece rakamlar
                        setPostalCode(value);
                    }}
                    className="border rounded w-full p-2 mb-2"
                />
                {error && <div className="text-red-500 mb-2">{error}</div>}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-renk1 rounded-md px-4 py-2 text-white"
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
export default EditAddressModal;
