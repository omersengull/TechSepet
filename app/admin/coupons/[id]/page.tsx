"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CouponDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [coupon, setCoupon] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const couponRes = await fetch(`/api/coupons/${id}`);
      const couponData = await couponRes.json();
      setCoupon(couponData);

      const usersRes = await fetch(`/api/users?ids=${couponData.userIds.join(',')}`);
      const usersData = await usersRes.json();
      setUsers(usersData);
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{coupon?.code}</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Genel Bilgiler</h2>
            <p>İndirim: %{coupon?.discount}</p>
            <p>Geçerlilik: {coupon?.validUntil?.toLocaleDateString()}</p>
            <p>Kullanım Sayısı: {coupon?.userIds?.length}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Kullananlar</h2>
            <ul className="list-disc pl-4">
              {users.map(user => (
                <li key={user.id} className="py-1">
                  {user.email} - {new Date(user.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}