"use client";
import React, { useState } from 'react';
import Head from 'next/head';

const HelpPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Nasıl sipariş verebilirim?",
      answer: "Hesabınıza giriş yaparak ana sayfadan veya detaylı arama menüsünden bir ürün seçip sepete ekleyerek daha sonra sağ üst köşeden sepetinize gidip siparişi tamamlayarak sipariş verebilirsiniz."
    },
    {
      question: "İade süreci nasıl işliyor?",
      answer: "İade talebinizi 14 gün içinde oluşturabilirsiniz. 'Siparişlerim' bölümünden iade talebi oluşturup kargomuzu ücretsiz olarak adresinizden alıyoruz."
    },
    {
      question: "Ödeme seçenekleri nelerdir?",
      answer: "Kredi/banka kartı, havale/EFT, kapıda ödeme ve dijital cüzdan seçeneklerimiz bulunmaktadır."
    },
    {
      question: "Ürünler orijinal mi?",
      answer: "Tüm ürünlerimiz resmi distribütörlerden temin edilmekte ve orijinal garanti belgeleriyle gönderilmektedir."
    },
    {
      question: "Kargo ücreti ne kadar?",
      answer: "150 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki siparişlerde sabit 15 TL kargo ücreti uygulanır."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Yardım Merkezi | E-Ticaret Sitesi</title>
        <meta name="description" content="Sıkça sorulan sorular ve yardım merkezi" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Başlık */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Yardım Merkezi</h1>
        <p className="text-center text-gray-600 mb-12">Sormak istediğiniz her şey için buradayız</p>

        {/* SSS Bölümü */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <span className="text-gray-500">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="p-4 bg-gray-50 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Yardım Bölümleri */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Sipariş Süreci</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Siparişinizi 24 saat içinde kargoya veriyoruz</li>
              <li>• Stok durumunu ürün sayfasında görebilirsiniz</li>
              <li>• Siparişinizi 1 saat içinde iptal edebilirsiniz</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ödeme Yöntemleri</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Kredi kartına 3-12 ay taksit imkanı</li>
              <li>• Kapıda nakit/kredi kartı ile ödeme</li>
              <li>• Havale/EFT ile %3 indirim</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">İade & Değişim</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 14 gün içinde iade edebilirsiniz</li>
              <li>• Ücretsiz kargo ile iade alımı</li>
              <li>• İade işlemi 3 iş günü içinde tamamlanır</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">İletişim</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 0312 476 85 39 (09:00-18:00)</li>
              <li>• techsepet@gmail.com</li>
             
            </ul>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default HelpPage;