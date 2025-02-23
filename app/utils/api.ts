export const searchProducts = async (query: string) => {
    if (!query) return [];
  
    try {
      const res = await fetch(`/api/search?q=${query}`);
      if (!res.ok) throw new Error("Arama işlemi başarısız oldu");
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API arama hatası:", error);
      return [];
    }
  };
  