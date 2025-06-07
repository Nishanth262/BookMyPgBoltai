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

export type PropertyType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD'

export type RoomAvailability = {
  singleRooms: number
  doubleRooms: number
  tripleRooms: number
  quadRooms: number
}

export type RoomPricing = {
  singlePrice: number
  doublePrice: number
  triplePrice: number
  quadPrice: number
}

export type Property = {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  stateId: string
  district: string
  districtId: string
  pincode: string
  
  // Room availability and pricing
  singleRooms: number
  doubleRooms: number
  tripleRooms: number
  quadRooms: number
  singlePrice: number
  doublePrice: number
  triplePrice: number
  quadPrice: number
  
  deposit: number
  amenities: string[]
  images: string[]
  
  // Legacy fields for backward compatibility
  type: PropertyType
  capacity: number
  price: number
  
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
  roomType: PropertyType
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

export type LocationFilter = {
  stateId?: string
  districtId?: string
  city?: string
}

export type PropertyFilters = {
  location: LocationFilter
  priceRange: {
    min: number
    max: number
  }
  roomTypes: PropertyType[]
  amenities: string[]
}