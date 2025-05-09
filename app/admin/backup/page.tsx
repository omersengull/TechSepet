'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
export default function BackupPage() {
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadBackups();
  }, []);

  const showNotification = (message: string, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/backup/create');
      setBackups(response.data.backups);
      showNotification(`Yedek oluşturuldu: ${response.data.backup}`);
    } catch (error) {
      showNotification('Hata: Yedek alınamadı!', 'error');
      console.error('Yedekleme hatası:', error);
    }
    setLoading(false);
  };
  
  const loadBackups = async () => {
    try {
      const response = await axios.get('/api/backup/list');
      setBackups(response.data.backups);
    } catch (error) {
      showNotification('Yedekler yüklenemedi!', 'error');
      console.error('Yedek listeleme hatası:', error);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    setRestoreLoading(true);
    try {
      await axios.post('/api/backup/restore', { backup: selectedBackup });
      showNotification(`Yedek geri yüklendi: ${selectedBackup}`);
      setSelectedBackup('');
      loadBackups();
    } catch (error) {
      showNotification('Geri yükleme başarısız!', 'error');
      console.error('Geri yükleme hatası:', error);
    }
    setRestoreLoading(false);
  };

  const downloadBackup = async (backup: string) => {
    try {
      const response = await axios.get(`/api/backup/download?file=${backup}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', backup);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showNotification('İndirme başarısız!', 'error');
      console.error('İndirme hatası:', error);
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

          <button
            onClick={loadBackups}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Yedekleri Yenile
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
                    <button
                      onClick={() => setSelectedBackup(backup)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                    >
                      Geri Yükle
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedBackup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Geri Yükleme Onayı</h3>
              <p className="mb-4">"{selectedBackup}" adlı yedek geri yüklenecek. Bu işlem mevcut verilerin üzerine yazacaktır. Devam etmek istiyor musunuz?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedBackup('')}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  İptal
                </button>
                <button
                  onClick={handleRestore}
                  disabled={restoreLoading}
                  className={`px-4 py-2 rounded-md text-white ${restoreLoading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {restoreLoading ? 'Geri Yükleniyor...' : 'Onayla'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
