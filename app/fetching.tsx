export default async function assignSpecifications() {
    const products = [
        {
            productId: "679b4b28303ffc1e01f9c740",
            specifications: [
                { name: "Marka ve Model", value: "STEELSERIES Aerox 3 Snow Gaming Mouse Beyaz" },
                { name: "Mouse Türü", value: "Gaming Mouse" },
                { name: "Bağlantı Türü", value: "Kablolu ve Kablosuz (USB-C, Bluetooth)" },
                { name: "Sensör Türü", value: "TrueMove Air Optik Sensör" },
                { name: "DPI", value: "200 - 18,000 DPI" },
                { name: "Tuş Sayısı", value: "6" },
                { name: "Programlanabilir Tuşlar", value: "Var" },
                { name: "Scroll Tekerleği", value: "Var" },
                { name: "Ağırlık", value: "68 g" },
                { name: "Boyutlar", value: "120.6 x 57.9 x 21.5 mm" },
                { name: "Renk Seçenekleri", value: "Beyaz (Snow)" },
                { name: "Malzeme", value: "Polikarbonat Plastik" },
                { name: "Garanti Süresi", value: "2 Yıl" },
                { name: "Ergonomik Tasarım", value: "Var" },
                { name: "Aydınlatma", value: "RGB Aydınlatma" },
                { name: "DPI Ayarlama Düğmesi", value: "Var" },
                { name: "Oyun Özellikleri", value: "Ultra Hafif Tasarım, Hızlı Yanıt Süresi" },
                { name: "Çoklu Cihaz Desteği", value: "Var" },
                { name: "Pil Ömrü", value: "200 Saat (Bluetooth Modu)" },
                { name: "Şarj Edilebilir Pil", value: "Var" },
                { name: "Hızlı Şarj", value: "Var (15 dakikalık şarj ile 40 saat kullanım)" },
                { name: "Bluetooth Sürümü", value: "5.0" }
            ]
        }
    ];

    for (const product of products) {
        try {
            const response = await fetch("/api/assignSpecifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API isteği başarısız oldu: ${errorData.error}`);
            }

            const data = await response.json();
            console.log(`Başarılı: ${product.productId}`, data);
        } catch (error) {
            console.error(`Hata (${product.productId}):`, error);
        }
    }
}
