"use client";
import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { HashLoader } from "react-spinners";
interface RawItem {
  name?: string;
  quantity?: string | number;
  price?: string | number;
  [key: string]: any;
}
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  amount: number;

}

interface Order {
  id: string;
  items: string;
  createdAt: string;
  [key: string]: any;
}

interface Sale {
  orderId: string;
  product_name: string;
  quantity: number;
  price: number;
  date: string;
}



const SalesPDF = ({ salesData }: { salesData: Sale[] }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title} fixed>Satış Raporu</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Sipariş ID</Text>
          <Text style={styles.tableHeader}>Ürün Adı</Text>
          <Text style={styles.tableHeader}>Miktar</Text>
          <Text style={styles.tableHeader}>Fiyat</Text>
          <Text style={styles.tableHeader}>Tarih</Text>
        </View>
        {salesData.map((sale, index) => (
          <View key={`${sale.orderId}-${index}`} style={styles.tableRow}>
            <Text style={styles.tableCell}>{sale.orderId}</Text>
            <Text style={styles.tableCell}>{sale.product_name}</Text>
            <Text style={styles.tableCell}>{sale.quantity}</Text>
            <Text style={styles.tableCell}>{sale.price.toFixed(2)} TL</Text>
            <Text style={styles.tableCell}>{new Date(sale.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
const SalesReport = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch("/api/sales");
        if (!res.ok) throw new Error('Veri alınamadı');
        const orders: Order[] = await res.json();

        const formattedSales: Sale[] = [];

        orders.forEach(order => {
          if (!order.id) {
            console.error("Geçersiz sipariş ID’si", order);
            return;
          }

          const raw = order.items;
          let rawItems: RawItem[] = [];

          try {
            if (Array.isArray(raw)) {
              rawItems = raw as RawItem[];
            } else if (typeof raw === "string") {
              // 1) Trim
              let temp: any = raw.trim();
              // Tırnakları ve gereksiz escape karakterlerini temizle
              temp = temp.replace(/^"+|"+$/g, ''); // Baştaki ve sondaki tırnakları sil
              temp = temp.replace(/\\"/g, '"'); // Escape edilmiş tırnakları düzelt
              
              try {
                temp = JSON.parse(temp);
                // Eğer hala string ise bir kez daha parse et
                if (typeof temp === "string") {
                  temp = JSON.parse(temp);
                }
              } catch (e) {
                console.error("Parse hatası, ham veri:", temp);
                throw e;
              }

              if (!Array.isArray(temp)) {
                throw new Error("Ürün listesi dizi değil");
              }
              rawItems = temp as RawItem[];
            } else {
              throw new Error("Beklenmeyen items türü");
            }

            // 3) Şimdi rawItems emin olduğumuz dizi halinde
            rawItems.forEach((item, idx) => {
              if (!item.name && !item.product_name && !item.id) {
                console.warn("Eksik isimli ürün:", { idx, item });
              }
              // Miktar / quantity
              const productName = [
                item.name,
                item.product_name,
                item.productName, // camelCase alternatifi
                item.productId,
                item.id,
                item.title,
                `Bilinmeyen Ürün (${new Date().getTime()})` // Benzersiz ID
              ].find(Boolean) as string; // İlk truthy değeri al
              
              const rawQty = item.quantity ?? item.amount ?? item.qty ?? item.count ?? 0;
              const rawPrice = item.price ?? item.unitPrice ?? item.fiyat ?? item.tutar ?? 0;
              
              // Sayısal değerleri daha iyi parse etmek için:
              const qty = Math.abs(Number(rawQty)) || 0;
              const price = Math.abs(Number(rawPrice)) || 0;
              formattedSales.push({
                orderId: order.id,
                product_name: productName,
                quantity: qty,
                price: price,
                date: order.createdAt
              });
            });

          } catch (e) {
            console.error("Sipariş parse hatası:", { orderId: order.id, rawData: raw, error: e });
          }
        });



        setSalesData(formattedSales);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const handleDownloadExcel = () => {
    const dataForExcel = salesData.map(sale => ({
      "Sipariş ID": sale.orderId,
      "Ürün Adı": sale.product_name,
      "Miktar": sale.quantity,
      "Fiyat": sale.price,
      "Tarih": new Date(sale.date).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Satış Raporu");
    XLSX.writeFile(wb, "satis_raporu.xlsx");
  };

  if (isLoading) return <div className="container flex min-h-screen justify-center items-center"><HashLoader/></div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Satış Raporu</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleDownloadExcel}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Excel Olarak İndir
        </button>
        <PDFDownloadLink
          document={<SalesPDF salesData={salesData} />}
          fileName="satis_raporu.pdf"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {({ loading }) => loading ? "PDF Hazırlanıyor..." : "PDF Olarak İndir"}
        </PDFDownloadLink>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Sipariş ID</th>
              <th className="border px-4 py-2">Ürün Adı</th>
              <th className="border px-4 py-2">Miktar</th>
              <th className="border px-4 py-2">Fiyat</th>
              <th className="border px-4 py-2">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale, index) => (
              <tr key={`${sale.orderId}-${index}`} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-mono">{sale.orderId}</td>
                <td className="border px-4 py-2">{sale.product_name}</td>
                <td className="border px-4 py-2">{sale.quantity}</td>
                <td className="border px-4 py-2">{sale.price.toFixed(2)} TL</td>
                <td className="border px-4 py-2">{new Date(sale.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  table: { display: "flex", width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf" },
  tableRow: { flexDirection: "row" },
  tableHeader: { width: "20%", padding: 5, fontWeight: 'bold', borderWidth: 1, borderColor: "#bfbfbf", backgroundColor: "#f0f0f0" },
  tableCell: { width: "20%", padding: 5, borderWidth: 1, borderColor: "#bfbfbf" }
});

export default SalesReport;