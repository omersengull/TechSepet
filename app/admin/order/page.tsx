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

const Order = () => {
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
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          let parsedItems: Item[] = [];
          if (order.items) {
            console.log("Order Items (Raw):", order.items);
            try {
              const firstParse = JSON.parse(order.items);

              if (typeof firstParse === "string") {
                parsedItems = JSON.parse(firstParse);
              } else if (Array.isArray(firstParse)) {
                parsedItems = firstParse;
              }

              console.log("Parsed Items for Order:", parsedItems);
            } catch (error) {
              console.error(
                "Error parsing items for Order ID:",
                order.id,
                "Raw Items:",
                order.items,
                error
              );
              parsedItems = [];
            }
          }

          return (
            <div
              key={order.id}
              className="rounded-xl gap-10 border-renk1 border w-full flex flex-row p-4"
            >
              <div className="font-semibold">Sipariş No: {order.id}</div>
              <div>Müşteri No: {order.userId}</div>
              <div>
                <strong>Ürünler:</strong>
                <ul>
                  {Array.isArray(parsedItems) && parsedItems.length > 0 ? (
                    parsedItems.map((item, index) => (
                      <li key={index} className="mb-2">
                        <div><strong>Product Name:</strong> {item.name}</div>
                        <div><strong>Price:</strong> {priceClip(item.price)} ₺</div>
                        <div><strong>Quantity:</strong> {item.quantity}</div>
                        
                      </li>
                    ))
                  ) : (
                    <li>No items available</li>
                  )}
                </ul>
              </div>
              <div>
                Toplam Ücret: <strong>{priceClip(order.totalPrice)} ₺</strong>
              </div>
              <div>
                Sipariş Tarihi:{" "}
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
