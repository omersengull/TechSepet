import { FaSearch } from "react-icons/fa";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Search = () => {
  const [query, setQuery] = useState(""); // Kullanıcının girdiği arama kelimesi
  const [results, setResults] = useState<any[]>([]); // API'den gelen sonuçlar
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown açık mı?
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router=useRouter();
 const handleRoute=(id)=>{
  setIsDropdownOpen(false);
  router.push(`product/${id}`)
 }
  const searchProducts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${value}`);
        if (!res.ok) throw new Error("Arama işlemi başarısız oldu");

        const data = await res.json();
        setResults(data);
        setIsDropdownOpen(true); // Sonuçlar gelince dropdown aç
      } catch (error) {
        console.error("Arama hatası:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setIsDropdownOpen(false); // Input boşsa dropdown kapat
    }
  };

  // Dropdown dışında bir yere tıklanınca kapanmasını sağlar
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full md:w-72 lg:w-120 xl:w-[650px]">
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
        <FaSearch className="text-gray-500 mr-2 cursor-pointer" />
        <input
          onChange={searchProducts}
          value={query}
          className="outline-none bg-transparent placeholder-gray-500 text-gray-700 w-full"
          type="text"
          placeholder="Ne arıyorsunuz?"
          onFocus={() => results.length > 0 && setIsDropdownOpen(true)} // Input'a tıklayınca dropdown aç
        />
      </div>

      {/* 🔍 Arama Sonuçları (Dropdown) */}
      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
          {loading ? (
            <p className="p-2 text-gray-500">Yükleniyor...</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li onClick={()=>{handleRoute(product.id)}} key={product.id} className="p-2 border-b text-black cursor-pointer">
                  <div className="flex">
                    <Image className="mr-1" src={product.image} alt="resim" width={40} height={40} />
                    {product.name}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-2 text-gray-500">Sonuç bulunamadı</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
