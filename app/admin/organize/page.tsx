"use client";
import { useCallback, useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import Link from 'next/link';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type ProductWithCategory = Product & {
  category: {
    name: string;
  } | null;
};

export default function OrganizeProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (productId: string, imageUrl: string) => {
    toast.loading("Silme işlemi için bekleyin...");
    
    try {
      // Resmi sil
      await axios.post("/api/delete-image", { imageUrl });
      
      // Ürünü sil
      await axios.delete(`/api/product/${productId}`);
      
      // Ürün listesini güncelle
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      toast.success("Ürün başarıyla silindi!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Silme hatası: ${errorMessage}`);
    } finally {
      toast.dismiss();
    }
  }, []);

  if (loading) return <div className='min-h-screen flex justify-center items-center'><HashLoader /></div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-6">Ürün Yönetimi</h1>

      {/* Masaüstü Görünüm */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left">Ürün Adı</th>
              <th className="py-3 px-4 border-b text-left">Fiyat</th>
              <th className="py-3 px-4 border-b text-left">Kategori</th>
              <th className="py-3 px-4 border-b text-left">İşlemler</th>
              <th className="py-3 px-4 border-b text-left">Ürünü Sil</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{product.name}</td>
                <td className="py-3 px-4 border-b">₺{product.price}</td>
                <td className="py-3 px-4 border-b">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {product.category?.name || 'Kategori yok'}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <Link
                    href={`/admin/organize/edit/${product.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Düzenle
                  </Link>
                </td>
                <td className="py-3 px-4 border-b">
                  <button 
                    onClick={() => handleDelete(product.id, product.image)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil Görünüm */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                ₺{product.price}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600 text-sm">
                  {product.category?.name || 'Kategori yok'}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/organize/edit/${product.id}`}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                >
                  Düzenle
                </Link>
                <button 
                  onClick={() => handleDelete(product.id, product.image)}
                  className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}