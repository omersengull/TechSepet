"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Item {
  description: string;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  totalPrice: number;
  AddressInfo: string;
  items: Item[] | string;
}

const OrderCard = ({ order }: { order: Order }) => {
  let items: Item[] = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    if (!Array.isArray(items)) items = [];
  } catch (error) {
    console.error('Ürünleri işlerken hata oluştu:', error);
    items = [];
  }

  return (
    <div className="border rounded-2xl border-renk1 p-6 mb-4 bg-white  transition-transform transform w-3/4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sipariş Numarası: {order.id}</h2>
        <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
      </div>
      <div>
        <p><strong>Toplam Fiyat:</strong> ₺ {order.totalPrice}</p>
        <p><strong>Adres:</strong> {order.AddressInfo}</p>
        <p><strong>Ürünler:</strong></p>
        <ul className="list-disc list-inside ml-4">
          {items.map((item, index) => (
            <li key={index}>{item.description} - {item.quantity} adet</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders'); // API endpointi
        setOrders(response.data);
      } catch (error) {
        console.error('Siparişler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-8">Siparişlerim</h1>
      {loading ? (
        <div className="text-center text-lg">Yükleniyor...</div>
      ) : orders.length > 0 ? (
        <div className="flex flex-col items-center gap-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Henüz siparişiniz bulunmamaktadır.</div>
      )}
    </div>
  );
};

export default OrdersPage;
