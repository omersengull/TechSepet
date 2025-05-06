'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface OrderActionsProps {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
  currentTracking: string
  statusOptions: Array<{ value: string; label: string }>
  paymentOptions: Array<{ value: string; label: string }>
}

export default function OrderActions({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTracking,
  statusOptions,
  paymentOptions
}: OrderActionsProps) {
  
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [trackingNumber, setTrackingNumber] = useState(currentTracking)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async () => {
    setIsUpdating(true)
  
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          paymentStatus,
          shippingTrackingNumber: trackingNumber
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to update order')
      }
  
      toast.success('Sipariş başarıyla güncellendi.')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update order')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }
  

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Sipariş Eylemleri</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Durum</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        

        <div>
          <label className="block text-sm font-medium mb-1">
            Takip Numarası
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Takip numarası girin..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className={`w-full py-2 px-4 rounded-md text-white ${
            isUpdating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </button>
      </div>
    </div>
  )
}