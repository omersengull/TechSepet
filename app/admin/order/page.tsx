"use client";
import React, { useEffect, useState } from 'react';

interface Item {
  productId: string;
  quantity: number;
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">User ID</th>
            <th className="border border-gray-300 px-4 py-2">Items</th>
            <th className="border border-gray-300 px-4 py-2">Total Price</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            let parsedItems: Item[] = [];
            try {
              parsedItems = JSON.parse(order.items); // Parsing the JSON string
            } catch (error) {
              console.error('Error parsing items:', error);
            }

            return (
              <tr key={order.id}>
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.userId}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul>
                    {Array.isArray(parsedItems) ? (
                      parsedItems.map((item, index) => (
                        <li key={index}>
                          Product ID: {item.productId}, Quantity: {item.quantity}
                        </li>
                      ))
                    ) : (
                      <li>Invalid items format</li>
                    )}
                  </ul>
                </td>
                <td className="border border-gray-300 px-4 py-2">{order.totalPrice}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
