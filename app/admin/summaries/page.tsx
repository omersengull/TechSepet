"use client";
import priceClip from "@/app/utils/priceClip";
import React, { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SummaryData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  mostOrderedProducts: { name: string; totalQuantity: number }[];
  newCustomers: number;
}

const Summaries = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch("/api/summary"); // API'den verileri çek
        if (!response.ok) {
          throw new Error("Failed to fetch summary data");
        }
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setError("Özet verilerini yüklerken bir hata oluştu.");
      }
    };

    fetchSummaryData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!summaryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Aylık Özet</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Toplam Gelir</h2>
          <p className="text-2xl font-bold">{priceClip(summaryData.totalRevenue.toFixed(2))} ₺</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Toplam Sipariş</h2>
          <p className="text-2xl font-bold">{summaryData.totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Ortalama Sipariş Değeri</h2>
          <p className="text-2xl font-bold">{priceClip(summaryData.averageOrderValue.toFixed(2))} ₺</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Yeni Müşteriler</h2>
          <p className="text-2xl font-bold">{summaryData.newCustomers}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 col-span-2">
          <h2 className="text-xl font-semibold">En Çok Sipariş Edilen Ürünler</h2>
          <ul>
            {summaryData.mostOrderedProducts.map((product, index) => (
              <li key={index} className="text-lg">
                {product.name} - {product.totalQuantity} adet
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Summaries;
