'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
export default function BackupPage() {
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });



  const showNotification = (message: string, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };


  // Yedekleri yükle
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const res = await axios.get('/api/backup/list');
        setBackups(res.data.backups || []);
      } catch (error) {
        console.error('Yedekler yüklenemedi:', error);
      }
    };
    fetchBackups();
  }, []);
  const createBackup = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/backup/create');
      setBackups(prev => [res.data.backup, ...prev]);
      toast.success('Yedek oluşturuldu!');
    } catch (error) {
      console.error('Yedekleme hatası:', error);
      toast.error('Hata: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };
  const downloadBackup = async (filename: string) => {
  try {
    // 1. Doğrudan GET isteği yap, HEAD kontrolünü kaldır
    const response = await fetch(
      `/api/backup/download?file=${encodeURIComponent(filename)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(response.status === 404 
        ? 'Dosya bulunamadı' 
        : 'İndirme başarısız');
    }

    // 2. Blob işleme
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Temizlik
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    }, 100);

    showNotification('Dosya indirildi!');

  } catch (error) {
    console.error('İndirme hatası:', error);
    showNotification(error.message, 'error');
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Veritabanı Yedek Yönetimi</h1>

        {notification.show && (
          <div className={`mb-4 p-4 rounded-md ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {notification.message}
          </div>
        )}

        <div className="flex space-x-3 mb-8">
          <button
            onClick={createBackup}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Yedek Alınıyor...' : 'Yeni Yedek Oluştur'}
          </button>

          
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Mevcut Yedekler</h3>
          {backups.length === 0 ? (
            <p className="text-gray-500">Henüz yedek bulunmamaktadır.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {backups.map((backup) => (
                <li key={backup} className="py-3 flex justify-between items-center">
                  <span className="text-sm font-mono">{backup}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadBackup(backup)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                    >
                      İndir
                    </button>
                    
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        
      </div>
    </div>
  );
}
