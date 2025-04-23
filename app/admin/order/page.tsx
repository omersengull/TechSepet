"use client";
import priceClip from "@/app/utils/priceClip";
import React, { useEffect, useState } from "react";

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  inStock: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: string; // JSON string
  totalPrice: number;
  createdAt: string;
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
  const parseOrderItems = (itemsData: any): Item[] => {
    try {
      // İlk katmanı parse et: "[\"[{\\"...}\"]" -> ["{\\"...}"]
      
      if (typeof itemsData === 'string') {
        itemsData = JSON.parse(itemsData);
      }
      if (!Array.isArray(itemsData)) {
        itemsData = [itemsData];
      }
      return itemsData.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description || "",
        inStock: item.inStock !== false
      }));
  
    } catch (error) {
      console.error("Outer parse error:", error);
      return [];
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Siparişler Listesi</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const parsedItems = parseOrderItems(order.items);





          return (
            <div
              key={order.id}
              className="rounded-xl border border-renk1 w-full flex flex-col md:flex-row p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Sipariş ve Müşteri Bilgisi */}
              <div className="md:w-1/2 mb-4 md:mb-0">
                <strong className="block text-lg mb-2">Ürünler:</strong>
                {parsedItems.length > 0 ? (
                  <ul className="space-y-2">
                    {parsedItems.map((item, index) => (
                      <li
                        key={item.id ? item.id : `fallback-${index}`}
                        className="p-2 border border-gray-200 rounded-md"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/default-product.png";
                            }}
                          />
                          <div>
                            <div className="text-md font-medium">{item.name}</div>
                            <div className="text-sm">
                              Fiyat: {priceClip(item.price)} ₺ × {item.quantity} adet
                            </div>
                          </div>
                        </div>
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
