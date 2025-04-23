// app/admin/organize/edit/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { HashLoader } from 'react-spinners';
type Category = {
  id: string;
  name: string;
};
export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`);
      const data = await res.json();
      setProduct(data);
      setFormData(data);
    } catch (error) {
      console.error('Ürün bilgileri yüklenemedi:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.category // categoryId olarak gönder
        }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız');
      
      router.push('/admin/organize');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  if (!product) return <div className='flex min-h-screen justify-center items-center'><HashLoader/></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ürün Düzenle</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block mb-2">Ürün Adı</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Fiyat</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Açıklama</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <div>
        <label className="block mb-2">Kategori</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="">Kategori Seçin</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

        <button
          type="submit"
          className="bg-renk1 text-white px-4 py-2 rounded"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}