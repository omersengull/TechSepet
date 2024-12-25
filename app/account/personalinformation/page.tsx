import React, { useState, useEffect } from "react";

interface User {
    name?: string;
    surname?: string;
    birthday?: string;
    phone?: string;
    email?: string;
    gender?: string;
}

const Page = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [initialUser, setInitialUser] = useState<User | null>(null);
    const [change, setChange] = useState(false);

    const updatePersonalInformation = async () => {
        try {
            const response = await fetch("/api/updateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentUser),
            });

            if (!response.ok) {
                alert(`Sunucu hatası: ${response.status}`);
                return;
            }

            alert("Bilgiler başarıyla güncellendi!");
            if (currentUser) {
                setInitialUser(currentUser); // Türler uyuşuyor
            }
            setChange(false);
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    return <div>{/* UI Bileşenleri Burada */}</div>;
};

export default Page;
