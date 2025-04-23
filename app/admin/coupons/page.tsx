"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discountValue: number;
  validUntil: Date;
  isSingleUse: boolean;
}
type FormData = {
  discountValue: string; // ✅
  discountType: 'FIXED' | 'PERCENTAGE';
}
export default function CreateCouponPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'FIXED',
    discountValue: '', // ✅ Doğru alan
    maxDiscount: '',
    validUntil: '',
    isSingleUse: false,
  });
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);

  // Aktif kuponları çek
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const response = await fetch('/api/admin/coupons/active');
        const data = await response.json();
        setActiveCoupons(data);
      } catch (error) {
        console.error('Aktif kuponlar yüklenemedi:', error);
      }
    };
    fetchActiveCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: Number(formData.discountValue),
          discountType: formData.discountType,
          validUntil: new Date(formData.validUntil),
        }),
      });

      if (!response.ok) throw new Error('Kupon oluşturulamadı');

      toast.success('Kupon başarıyla oluşturuldu!');
      router.refresh(); // Listeyi güncelle
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-10 p-4">
      {/* Create Coupon Form */}
      <div className="w-full md:max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Yeni Kupon Oluştur</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Kupon Kodu</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">İndirim Tipi</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'FIXED' | 'PERCENTAGE' })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="FIXED">Sabit Tutar</option>
                <option value="PERCENTAGE">Yüzdelik</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                {formData.discountType === 'FIXED' ? 'İndirim Tutarı (₺)' : 'İndirim Oranı (%)'}
              </label>
              <input
                type="number"
                min="1"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {formData.discountType === 'PERCENTAGE' && (
            <div>
              <label className="block mb-2 font-medium">Maksimum İndirim (₺)</label>
              <input
                type="number"
                min="1"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Son Kullanma Tarihi</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full p-2 border rounded"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex items-center justify-start md:justify-end mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isSingleUse}
                  onChange={(e) => setFormData({ ...formData, isSingleUse: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="font-medium">Tek Kullanımlık</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-renk1 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Kuponu Oluştur
          </button>
        </form>
      </div>

      {/* Active Coupons List */}
      <div className="w-full md:max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Aktif Kuponlar</h2>

        {activeCoupons.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Henüz aktif kupon yok</p>
        ) : (
          <div className="space-y-3">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-bold text-lg text-renk1">{coupon.code}</h3>
                    <p className="text-sm text-gray-600">
                      {coupon.discountValue}
                      {coupon.discountValue > 100 ? '₺' : '%'} İndirim
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Geçerlilik: {new Date(coupon.validUntil).toLocaleDateString('tr-TR')}
                    </p>
                    <span className={`text-xs ${
                      coupon.isSingleUse ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {coupon.isSingleUse ? '✔ Tek kullanımlık' : '♻ Çok kullanımlık'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}