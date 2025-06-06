export type User = {
  id: string
  name: string
  email?: string
  phone: string
  avatar?: string
  role: 'USER' | 'OWNER' | 'ADMIN'
  isVerified: boolean
  createdAt: Date
}

export type PropertyType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'SHARED'

export type Property = {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  pincode: string
  price: number
  deposit: number
  amenities: string[]
  images: string[]
  type: PropertyType
  capacity: number
  rating: number
  reviewCount: number
  ownerId: string
  ownerName: string
  ownerAvatar?: string
  available: boolean
  featured: boolean
  createdAt: Date
}

export type Booking = {
  id: string
  propertyId: string
  propertyName: string
  propertyImage: string
  userId: string
  userName: string
  startDate: Date
  endDate: Date
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  paymentMethod?: string
  createdAt: Date
}

export type Review = {
  id: string
  propertyId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
}

export type Amenity = {
  id: string
  name: string
  icon: string
}

export type OtpCode = {
  id: string
  phone: string
  code: string
  type: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD'
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
  userId?: string
}