import { Address, Order, User } from "@prisma/client"

export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
} as const

export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  PENDING: 'PENDING'
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]
export type OrderItem = {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    name: string // null olmayacak şekilde
    description: string | null
    createdAt: Date
    updatedAt: Date
    discountAmount: number | null
  }
export type OrderWithRelations = Order & {
  orderItems: {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    name: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    discountAmount: number | null
  }[]
  user: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'surname'>
  address: Address | null
}