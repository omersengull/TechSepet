import { Product } from '@prisma/client'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  name: string
  image?: string | null
}

interface OrderDetailsProps {
  order: {
    id: string
    createdAt: Date
    updatedAt: Date | null
    totalPrice: number
    user: {
      id: string
      name: string | null
      email: string
      phone: string | null
    }
    address: {
      title: string
      address: string
      city: string
      postalCode: string
    } | null
  }
  orderItems: OrderItem[]
}


export default function OrderDetails({ order, orderItems }: OrderDetailsProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">#{order.id.slice(-6)}</h2>

      

      {/* Sipariş Öğeleri */}
      <div className="mb-8">
        <h3 className="font-medium mb-2">Sipariş Öğeleri</h3>
        <div className="border rounded-lg divide-y">
          {orderItems.map((item) => (
            <div key={item.id} className="p-4 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p>{item.quantity} x {item.price.toFixed(2)}₺</p>
              </div>
              <p>{(item.quantity * item.price).toFixed(2)}₺</p>
            </div>
          ))}
        </div>
      </div>

      {/* Özet Bilgiler */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Toplam:</span>
          <span className="font-medium">{order.totalPrice.toFixed(2)}₺</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Sipariş Tarihi:</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
