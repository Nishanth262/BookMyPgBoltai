export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'owner' | 'admin'
  phone?: string
  createdAt: Date
}

export type PropertyType = 'single' | 'double' | 'triple' | 'shared'

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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
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