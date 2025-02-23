"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductsCard from "../components/Home/ProductsCard";
import { Product } from "@prisma/client";
import { ObjectId } from 'bson';
interface Category{
  id:ObjectId;
  name:string;
}


const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
      }
    }

    fetchCategories();
  }, [])

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

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState<{ [key: string]: string[] }>({});
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);

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
    setSelectedSpecifications({});
  };

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

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

  const toggleSpecification = (specName: string) => {
    setExpandedSpec(expandedSpec === specName ? null : specName);
  };



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

  const selectedCategoryObjectId = products.find(product =>
    product.categoryId && // Null veya undefined olanları kontrol et
    product.categoryId.toString() === categories.find(cat => cat.name === selectedCategory)?.id.toString()
  )?.categoryId?.toString();


  console.log("Selected Category:", selectedCategory);
  console.log("Seçili Kategorinin ObjectId'si:", selectedCategoryObjectId);
  console.log("Ürünlerin Category ID Değerleri:", products.map(p => p.categoryId?.toString()));

  // Eğer `selectedCategoryObjectId` boşsa, kategoriye göre filtreleme yapma
  const availableBrands = Array.from(
    new Set(
      products
        .filter((product: Product) =>
          product.categoryId && // `null` veya `undefined` olanları filtrele
          selectedCategoryObjectId && // Eğer kategori seçili değilse tüm markaları göster
          product.categoryId.toString() === selectedCategoryObjectId // ObjectId ile eşleştirme yap
        )
        .map((product: Product) => product.brand.toUpperCase())
    )
  );

  console.log("Filtered Available Brands:", availableBrands);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("/api/product"); // Tip belirtiyoruz
        setProducts(response.data);
      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);
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
            (spec: any) => spec.specification.name === key && spec.value === value
          )
        )
    );

    return matchesCategory && matchesBrand && matchesPrice && matchesSpecifications;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-14 py-6 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg lg:sticky lg:top-4 h-fit overflow-y-auto max-h-screen scrollbar-hide">

          <h2 className="text-lg font-bold mb-4">Kategori</h2>
          <ul className="mb-6 text-base text-slate-800 space-y-2">
          {Array.from(new Set(categories.map(category => category.name)))
  .map((uniqueCategoryName) => {
    const category = categories.find(cat => cat.name === uniqueCategoryName); // Orijinal kategori objesini al

    return (
      <li key={category?.id.toString()} className="hover:text-blue-500 text-lg transition">
        <a
          onClick={(e) => {
            e.preventDefault();
            handleCategoryClick(category?.name || "");
          }}
          href="#"
          className={`cursor-pointer ${selectedCategory === category?.name ? "text-blue-600 font-bold" : ""}`}
        >
          {category?.name}
        </a>
      </li>
    );
  })}

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
          <div className="mt-3">
          <h2 className="text-lg font-bold mt-6 mb-4">Marka</h2>
            {availableBrands.length > 0 ? (
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
            )}
          </div>

          {/* Özellik Filtreleme */}
          {selectedCategory && Object.entries(availableSpecifications).slice(1).map(([specName, values]) => (
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
                        checked={selectedSpecifications[specName]?.includes(value)}
                        onChange={() => handleSpecificationChange(specName, value)}
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
