"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductsCard from "../components/Home/ProductsCard";

const categories = [
  { key: "phone", label: "Telefon" },
  { key: "laptop", label: "Laptop" },
  { key: "smartwatch", label: "Akıllı Saat" },
  { key: "earphone", label: "Kulaklık" },
  { key: "gaming", label: "Gaming" },
  { key: "television", label: "Televizyon" },
  { key: "camera", label: "Kamera" },
  { key: "gameconsole", label: "Oyun Konsolu" },
];

const Page = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([89, 91499]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProducts(response.data);
      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setSelectedBrands([]);
  };

  const handleBrandSelect = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const availableBrands = Array.from(
    new Set(
      products
        .filter((product: any) =>
          selectedCategory
            ? product.category.toLowerCase() === selectedCategory.toLowerCase()
            : false
        )
        .map((product: any) => product.brand.toUpperCase())
    )
  );

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchesBrand = selectedBrands.length
      ? selectedBrands.includes(product.brand.toUpperCase())
      : true;

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-14 py-6 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg lg:sticky lg:top-4 h-fit">
          <h2 className="text-lg font-bold mb-4">Kategori</h2>
          <ul className="mb-6 text-base text-slate-800 space-y-2">
            {categories.map((category) => (
              <li key={category.key} className="hover:text-blue-500 text-lg transition">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.key);
                  }}
                  href="#"
                  className={`cursor-pointer ${
                    selectedCategory === category.key ? "text-blue-600 font-bold" : ""
                  }`}
                >
                  {category.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Marka Filtreleme (Kategori seçilince gösterilecek) */}
          {selectedCategory && availableBrands.length > 0 && (
            <>
              <h2 className="text-lg font-bold mb-4">Marka</h2>
              <div className="space-y-2">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandSelect(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Fiyat Filtreleme */}
          <h2 className="text-lg font-bold mt-6 mb-4">Fiyat</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="border rounded px-2 py-1 w-full"
            />
            <span className="hidden sm:block">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="bg-renk1 text-white text-center py-4 mb-6 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold">
              TechSepet ile avantajlarla dolu fırsatları yakala, hemen alışveriş yap!
            </h1>
          </div>

          {/* Ürünler Alanı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prd: any, index: number) => (
                <ProductsCard key={index} product={prd} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                Seçilen filtrelere uygun ürün bulunamadı.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
``
