// app/admin/stock/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

type ProductStock = {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: { name: string } | null;
  inStock:boolean;
};

export default function StockManagement() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    stock: number;
  } | null>(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const res = await fetch('/api/admin/stock');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Stok verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // app/admin/stock/page.tsx içinde
  const handleUpdateStock = async () => {
    if (!editingProduct) return;
  
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: editingProduct.id,
          newStock: editingProduct.stock
        }),
      });
  
      if (!response.ok) throw new Error('Güncelleme başarısız');
      
      // Tüm ürünleri yeniden çek
      await fetchStockData();
      
      // Güncellenen ürünün cache'ini temizle
      await fetch(`/api/revalidate?path=/product/${editingProduct.id}`);
      
      toast.success('Stok güncellendi!');
      setEditingProduct(null);
    } catch (error) {
      toast.error('Stok güncellenemedi');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <HashLoader size={50} color="#3B82F6" />
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Stok Yönetimi</h1>
      
      {/* Masaüstü Tablo */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left">Ürün Adı</th>
              <th className="py-3 px-4 text-left">Kategori</th>
              <th className="py-3 px-4 text-left">Fiyat</th>
              <th className="py-3 px-4 text-left">Stok</th>
              <th className="py-3 px-4 text-left">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id}
                className={`border-t ${product.stock < 10 ? 'bg-red-50' : ''}`}
              >
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">
                  {product.category?.name || '-'}
                </td>
                <td className="py-3 px-4">₺{product.price}</td>
                <td className="py-3 px-4">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        stock: Math.max(0, parseInt(e.target.value))
                      })}
                      className="w-20 p-1 border rounded"
                    />
                  ) : (
                    <span className={product.stock < 10 ? 'text-red-600' : ''}>
                      {product.stock}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingProduct?.id === product.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateStock}
                        className="bg-renk1 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingProduct({
                        id: product.id,
                        stock: product.stock
                      })}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Düzenle
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil Liste */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div 
            key={product.id}
            className={`bg-white p-4 rounded-lg shadow ${
              product.stock < 10 ? 'border-l-4 border-red-500' : ''
            }`}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="text-gray-600">
                {product.category?.name || '-'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm">₺{product.price}</span>
                <span className={`ml-4 ${
                  product.stock < 10 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  Stok: {product.stock}
                </span>
              </div>
              
              {editingProduct?.id === product.id ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      stock: Math.max(0, parseInt(e.target.value))
                    })}
                    className="w-20 p-1 border rounded text-sm"
                  />
                  <button
                    onClick={handleUpdateStock}
                    className="bg-renk1 text-white px-2 py-1 rounded text-sm"
                  >
                    ✔
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingProduct({
                    id: product.id,
                    stock: product.stock
                  })}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Düzenle
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}