"use client";
import priceClip from "@/app/utils/priceClip";
import React, { useEffect, useState } from "react";

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: string; // JSON string
  totalPrice: number;
  createdAt: string; // ISO 8601 formatında tarih
}

const OrderComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log("Fetched Orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Siparişler Listesi</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          let parsedItems: Item[] = [];
          if (order.items) {
            // Eğer order.items zaten bir array ise, parse işlemine gerek yok:
            if (Array.isArray(order.items)) {
              parsedItems = order.items;
            } 
            // Eğer stringse, JSON.parse işlemi yap:
            else if (typeof order.items === "string") {
              try {
                const parsed = JSON.parse(order.items);
                // Eğer parsed değeri array ise ata, değilse boş dizi ata:
                parsedItems = Array.isArray(parsed) ? parsed : [];
              } catch (error) {
                console.error("Error parsing items for Order ID:", order.id, error);
                parsedItems = [];
              }
            }
          }
          
          

          return (
            <div
              key={order.id}
              className="rounded-xl border border-renk1 w-full flex flex-col md:flex-row p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Sipariş ve Müşteri Bilgisi */}
              <div className="md:w-1/4 mb-4 md:mb-0">
                <div className="font-semibold text-lg mb-2">Sipariş No: {order.id}</div>
                <div className="text-sm text-gray-600">Müşteri No: {order.userId}</div>
              </div>
              {/* Ürün Listesi */}
              <div className="md:w-1/2 mb-4 md:mb-0">
                <strong className="block text-lg mb-2">Ürünler:</strong>
                {Array.isArray(parsedItems) && parsedItems.length > 0 ? (
                  <ul className="space-y-2">
                    {parsedItems.map((item, index) => (
                      <li key={index} className="p-2 border border-gray-200 rounded-md">
                        <div className="text-md font-medium">{item.name}</div>
                        <div className="text-sm">Fiyat: {priceClip(item.price)} ₺</div>
                        <div className="text-sm">Adet: {item.quantity}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">Ürün bulunamadı.</p>
                )}
              </div>
              {/* Sipariş Toplam ve Tarih Bilgileri */}
              <div className="md:w-1/4 text-right">
                <div className="text-lg font-semibold mb-2">
                  Toplam Ücret: {priceClip(order.totalPrice)} ₺
                </div>
                <div className="text-sm text-gray-600">
                  Sipariş Tarihi: {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderComponent;
