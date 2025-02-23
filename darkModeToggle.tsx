"use client";
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.add(savedTheme); // ✅ Tailwind için html'e ekle
        } else if (prefersDark) {
            setTheme("dark");
            document.documentElement.classList.add("dark"); // ✅ Tailwind için html'e ekle
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.remove("light", "dark"); // ✅ Önce temizle
        document.documentElement.classList.add(newTheme); // ✅ Yeni temayı ekle
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button 
            onClick={toggleTheme}
            className="p-3 text-lg rounded-3xl bg-gray-300 text-black dark:bg-gray-900 dark:text-white"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
};

export default DarkModeToggle;
