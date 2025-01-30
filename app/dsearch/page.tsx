"use client"
import { useState } from "react";

const brands = ["APPLE", "SAMSUNG", "DJI", "STEELSERIES", "SONY"];

const page = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([89, 91499]);

  const handleBrandSelect = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="container mx-auto pl-20 pr-10 py-6 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 pr-4">
          <h2 className="text-lg font-bold mb-4">Kategori</h2>
          <ul className="mb-6 text-lg text-slate-800 ml-3 ">
            <li className="mb-1"><a href="">Telefon</a></li>
            <li className="mb-1"><a href="">Laptop</a></li>
            <li className="mb-1"><a href="">Akıllı Saat</a></li>
            <li className="mb-1"><a href="">Kulaklık</a></li>
            <li className="mb-1"> <a href="">Gaming</a></li>
            <li className="mb-1"><a href="">Televizyon</a></li>
            <li className="mb-1"><a href="">Kamera</a></li>
            <li><a href="">Oyun Konsolu</a></li>
          </ul>

          <h2 className="text-lg font-bold mb-4">Marka</h2>
          <div className="ml-3">
            {brands.map((brand) => (
              <label key={brand} className="block mb-2">
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

          <h2 className="text-lg font-bold mt-6 mb-4">Fiyat</h2>
          <div className="flex items-center gap-2 ml-3">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="border rounded px-2 py-1 w-full"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-3/4">
          <div className="bg-renk1 text-white text-center py-4 mb-6 rounded">
            <h1 className="text-xl font-bold">TechSepet Kampanyalarını Keşfet!</h1>
          </div>



        </main>
      </div>
    </div>
  );
};

export default page;
