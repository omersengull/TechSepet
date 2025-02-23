"use client";
import React, { useState } from "react"; // ✅ React import edildi

const Rating = ({ onRate }: { onRate?: (stars: number) => void }) => {
  const [rating, setRating] = useState<number>(0); // ✅ `number` tipi eklendi

  const handleRate = (stars: number) => {
    setRating(stars);
    if (onRate) onRate(stars); // ✅ `onRate` çağrısı düzeltildi
  };

  return (
    <div className="flex"> {/* ✅ JSX içinde `div` artık tanımlı */}
      {[1, 2, 3, 4, 5].map((star) => ( // ✅ `map()` kullanımı düzeltildi
        <span
          key={star}
          className={`cursor-pointer text-xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => handleRate(star)}
        >
          ★ {/* ✅ Yıldız içeriği eklendi */}
        </span>
      ))}
    </div>
  );
};

export default Rating;
