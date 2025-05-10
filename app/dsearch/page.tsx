"use client";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import ProductsCard from "../components/Home/ProductsCard";
import { Product } from "@prisma/client";
import { ObjectId } from "bson";
import { Product as PrismaProduct, Review, Category as PrismaCategory } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { HashLoader } from "react-spinners";
interface Category {
  id: ObjectId;
  name: string;
}
export interface ProductWithReviews extends PrismaProduct {
  reviews: Review[];
  category: PrismaCategory;             // eklendi
  specifications: {
    specification: { name: string };    // eklendi
    value: string;
  }[];
}
const Page = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><HashLoader color="#3B82F6"/></div>}>
      <SearchComponent />
    </Suspense>
  );
};

export default Page;
const SearchComponent = () => {
  // Sıralama
  const [sortOption, setSortOption] = useState<string>("");
  // Kategori
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Ürünler
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  // Kategori dizisi
  const [categories, setCategories] = useState<Category[]>([]);
  // Marka dizisi
  const [brand, setBrand] = useState<string[]>([]);

  // Filtreleme için
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedSpecifications, setSelectedSpecifications] = useState<{ [key: string]: string[] }>({});
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<any>(null);

  const handleMouseEnter = (product: any) => {
    setHoveredProduct(product);
    console.log("Ürün üzerine gelindi:", product);
    // İsteğe bağlı: Burada modal açma gibi işlemler yapılabilir.
  };
  const searchParams = useSearchParams();
  const urlCategory = decodeURIComponent(searchParams?.get('category') || '');
  const cleanedUrlCategory = urlCategory.replace(/\s+/g, '').toLowerCase();
  const handleMouseLeave = () => {
    setHoveredProduct(null);
    console.log("Ürün üzerinden çıkıldı.");
    // İsteğe bağlı: Modal kapatma işlemleri yapılabilir.
  };
  // Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProducts(response.data as ProductWithReviews[]);

      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
      }
    };
    fetchProducts();
  }, []);
  const categoryMapping: Record<string, string> = {
    'phone': 'Telefon',
    'laptop': 'Laptop',
    'smartwatch': 'Akıllı Saat',
    'earphone': 'Kulaklık',
    'keyboard': 'Klavye',
    'mouse': 'Mouse',
    'television': 'Televizyon',
    'gameconsole': 'Oyun Konsolu',
    'camera': 'Kamera',
    'monitor':'Monitör'


  };
  const realCategoryName = urlCategory ? categoryMapping[urlCategory] : null;
  // Kategorileri çek
  useEffect(() => {
    if (realCategoryName) {
      handleCategoryClick(realCategoryName);
    }
  }, [realCategoryName]);
  useEffect(() => {
    const urlCategory = searchParams?.get("category");
    const realCategoryName = urlCategory ? categoryMapping[urlCategory] : null;

    // Kategoriler yüklendiyse ve kategori varsa seç
    if (categories.length > 0 && realCategoryName) {
      const matchedCategory = categories.find(cat =>
        cat.name.toLowerCase().replace(/\s+/g, '') === realCategoryName.toLowerCase().replace(/\s+/g, '')
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.name); // Seçimi yap
      }
    }
  }, [searchParams, categories]); // Hem URL hem kategori listesi değişimini dinle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
        const urlCategory = searchParams?.get('category');
        if (urlCategory && data.length > 0) {
          const realCategoryName = categoryMapping[urlCategory];
          const matchedCategory = data.find(cat => cat.name === realCategoryName);
          if (matchedCategory) setSelectedCategory(matchedCategory.name);
        }
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
      }
    };
    fetchCategories();
  }, [searchParams]);

  // Markaları çek
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        const data = await response.json();
        setBrand(data);
      } catch (error) {
        console.error("Markalar yüklenirken hata oluştu:", error);
      }
    };
    fetchBrands();
  }, []);

  // Kategori seçildiğinde
  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setSelectedBrands([]);
    setSelectedSpecifications({});
  };
  useEffect(() => {
    if (urlCategory) {
      handleCategoryClick(urlCategory);
    }
  }, [urlCategory]);
  // Marka değişimi
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Özellik seçimi
  const handleSpecificationChange = (specKey: string, value: string) => {
    setSelectedSpecifications((prev) => {
      const currentValues = prev[specKey] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [specKey]: currentValues.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [specKey]: [...currentValues, value],
        };
      }
    });
  };

  // Özellik başlığı açıp kapatma
  const toggleSpecification = (specName: string) => {
    setExpandedSpec(expandedSpec === specName ? null : specName);
  };

  // Mevcut özellikler (kategoriye göre)
  const availableSpecifications = (() => {
    const specsMap: { [key: string]: Set<string> } = {};
    products
      .filter((product: any) =>
        selectedCategory
          ? product.category?.name.toLowerCase() === selectedCategory.toLowerCase()
          : false
      )
      .forEach((product: any) => {
        product.specifications?.forEach((spec: any) => {
          if (!specsMap[spec.specification.name]) {
            specsMap[spec.specification.name] = new Set();
          }
          specsMap[spec.specification.name].add(spec.value);
        });
      });
    return specsMap;
  })();

  // Kategori ObjectId
  const selectedCategoryObjectId = categories
    .find(cat => cat.name === selectedCategory)
    ?.id
    .toString();

  // filtrelenmiş markalar:
  const availableBrands = Array.from(
    new Set(
      products
        .filter(product =>
          product.category?.name.toLowerCase() === selectedCategory?.toLowerCase()
        )
        .map(product => product.brand.toUpperCase())
    )
  );
  // Filtrelenmiş ürünler
  const filteredProducts = products.filter((product: any) => {
    const categoryName =
      product.category &&
        typeof product.category === "object" &&
        typeof product.category.name === "string"
        ? product.category.name.toLowerCase().trim()
        : "";

    const matchesCategory = selectedCategory
      ? categoryName === selectedCategory.toLowerCase().trim()
      : true;

    const matchesBrand = selectedBrands.length
      ? selectedBrands.includes(product.brand.toUpperCase())
      : true;

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    const matchesSpecifications = Object.entries(selectedSpecifications).every(
      ([key, values]) =>
        values.length === 0 ||
        values.some((value) =>
          product.specifications?.some(
            (spec: any) =>
              spec.specification.name === key && spec.value === value
          )
        )
    );

    return matchesCategory && matchesBrand && matchesPrice && matchesSpecifications;
  });

  // "Yüksek puanlı" için ortalama rating hesapla
  function getAverageRating(product: any) {
    const { reviews } = product;
    if (!reviews || reviews.length === 0) {
      return 0; // Henüz değerlendirme yoksa 0 kabul ediyoruz
    }
    const total = reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return total / reviews.length;
  }

  // Filtrelenmiş ürünleri sıralama
  const finalProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "dusukFiyat":
        return a.price - b.price; // Küçükten büyüğe
      case "yuksekFiyat":
        return b.price - a.price; // Büyükten küçüğe

      case "cokDegerlendirilen":
        // Değerlendirme sayısına göre çoktan aza
        return (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0);

      case "yuksekPuanli":
        // Ortalama puana göre büyükten küçüğe
        return getAverageRating(b) - getAverageRating(a);
      case "yeniEklenen":
        // Tarihe göre en yeni olanı önce göstermek
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      default:
        return 0;
    }
  });


  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-14 py-6 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg lg:sticky lg:top-4 h-fit overflow-y-auto max-h-screen scrollbar-hide">
          <h2 className="text-lg font-bold mb-4">Kategori</h2>
          <ul className="mb-6 text-base text-slate-800 space-y-2">
            {Array.from(new Set(categories.map((category) => category.name))).map(
              (uniqueCategoryName) => {
                const category = categories.find(
                  (cat) => cat.name === uniqueCategoryName
                );
                return (
                  <li
                    key={category?.id.toString()}
                    className="hover:text-blue-500 text-lg transition"
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category?.name || "");
                      }}
                      href="#"
                      className={`cursor-pointer ${selectedCategory === category?.name
                          ? "text-blue-600 font-bold"
                          : ""
                        }`}
                    >
                      {category?.name}
                    </a>
                  </li>
                );
              }
            )}
          </ul>

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

          {/* Marka Filtreleme */}
          <div className="mt-3">
            <h2 className="text-lg font-bold mt-6 mb-4">Marka</h2>
            {!selectedCategory ? (
              <p className="text-gray-500">Marka filtresi için lütfen bir kategori seçin.</p>
            ) : availableBrands.length > 0 ? (
              availableBrands.map((brnd, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brnd)}
                    onChange={() => handleBrandChange(brnd)}
                    className="mr-2"
                  />
                  {brnd}
                </label>
              ))
            ) : (
              <p className="text-gray-500">Bu kategoride marka bulunamadı.</p>
            )
            }
          </div>

          {/* Özellik Filtreleme */}
          {selectedCategory &&
            Object.entries(availableSpecifications)
              .slice(1)
              .map(([specName, values]) => (
                <div key={specName}>
                  <h2
                    className="text-lg font-bold mt-4 mb-2 cursor-pointer"
                    onClick={() => toggleSpecification(specName)}
                  >
                    {specName}
                  </h2>
                  {expandedSpec === specName && (
                    <div>
                      {Array.from(values).map((value) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSpecifications[specName]?.includes(
                              value
                            )}
                            onChange={() =>
                              handleSpecificationChange(specName, value)
                            }
                            className="mr-2"
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="bg-red-600 text-white text-center py-4 mb-6 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold">
              TechSepet ile avantajlarla dolu fırsatları yakala, hemen alışveriş yap!
            </h1>
          </div>

          {/* Sıralama Seçeneği */}
          <div className="flex md:justify-end justify-center w-full">
            <select
              className="custom-select mb-5 border-2 py-1 rounded-xl px-3 border-slate-500 outline-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="" disabled hidden>
                Sıralama
              </option>
              <option value="dusukFiyat">En düşük fiyat</option>
              <option value="yuksekFiyat">En yüksek fiyat</option>
              <option value="cokDegerlendirilen">Çok değerlendirilenler</option>
              <option value="yuksekPuanli">Yüksek puanlılar</option>
              <option value="cokSatan">Çok satanlar</option>
              <option value="yeniEklenen">Yeni eklenenler</option>
            </select>
          </div>

          {/* Ürünler Alanı (Filtrelenmiş + Sıralanmış) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {finalProducts.length > 0 ? (
              finalProducts.map((prd: any, index: number) => (
                <ProductsCard
                  key={index}
                  product={prd}
                  onMouseEnter={() => handleMouseEnter(prd)}
                  onMouseLeave={handleMouseLeave}
                />
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

