'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UpdateOrderFormProps {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
  currentTracking: string
  statusOptions: { value: string; label: string }[]
  paymentOptions: { value: string; label: string }[]
}

export default function UpdateOrderForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTracking,
  statusOptions,
  paymentOptions
}: UpdateOrderFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [trackingNumber, setTrackingNumber] = useState(currentTracking)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        throw new Error('Güncelleme başarısız')
      }

      toast.success('Sipariş güncellendi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
      console.error('Update error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Sipariş Durumu</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ödeme Durumu</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          {paymentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kargo Takip No</label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Takip numarası girin"
        />
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className={`w-full py-2 px-4 rounded-lg text-white ${
          isUpdating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
      </button>
    </form>
  )
}