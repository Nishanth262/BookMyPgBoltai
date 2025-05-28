import { create } from 'zustand'
import { Property, PropertyType } from '../lib/types'

interface PropertyState {
  properties: Property[]
  featured: Property[]
  isLoading: boolean
  error: string | null
  filters: {
    city: string
    priceMin: number
    priceMax: number
    type: PropertyType | null
    amenities: string[]
  }
  fetchProperties: () => Promise<void>
  setFilters: (filters: Partial<PropertyState['filters']>) => void
  getPropertyById: (id: string) => Property | undefined
}

// Mock properties data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern PG with Balcony',
    description: 'A modern, well-ventilated PG accommodation with private balcony and attached bathroom. Includes all utilities and high-speed WiFi. Close to major tech parks.',
    address: '123 Koramangala Main Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    price: 12000,
    deposit: 24000,
    amenities: ['WiFi', 'AC', 'TV', 'Washing Machine', 'Kitchen', 'Power Backup', 'Housekeeping'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    type: 'single',
    capacity: 1,
    rating: 4.8,
    reviewCount: 24,
    ownerId: '2',
    ownerName: 'Jane Smith',
    ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    available: true,
    featured: true,
    createdAt: new Date('2023-10-15')
  },
  {
    id: '2',
    title: 'Spacious Double Sharing PG',
    description: 'Comfortable double sharing accommodation with spacious rooms and modern amenities. Fully furnished with study table, wardrobe, and comfortable beds.',
    address: '45 HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    price: 8500,
    deposit: 17000,
    amenities: ['WiFi', 'Gym', 'Dining', 'Laundry', 'CCTV', 'Security'],
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    type: 'double',
    capacity: 2,
    rating: 4.5,
    reviewCount: 18,
    ownerId: '2',
    ownerName: 'Jane Smith',
    ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    available: true,
    featured: false,
    createdAt: new Date('2023-11-05')
  },
  {
    id: '3',
    title: 'Premium Single Room PG',
    description: 'Luxurious single room PG accommodation with premium amenities including AC, TV, attached bathroom, and daily housekeeping. Walking distance to metro station.',
    address: '78 Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    price: 15000,
    deposit: 30000,
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom', 'Housekeeping', 'Food', 'Gym'],
    images: [
      'https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/6969866/pexels-photo-6969866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    type: 'single',
    capacity: 1,
    rating: 4.9,
    reviewCount: 32,
    ownerId: '2',
    ownerName: 'Jane Smith',
    ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    available: true,
    featured: true,
    createdAt: new Date('2023-09-20')
  },
  {
    id: '4',
    title: 'Budget Friendly Triple Sharing',
    description: 'Affordable triple sharing accommodation for students and working professionals. Includes basic amenities and is located near major educational institutions.',
    address: '34 BTM Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560076',
    price: 6500,
    deposit: 13000,
    amenities: ['WiFi', 'Common TV', 'Food', 'Water Purifier'],
    images: [
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    type: 'triple',
    capacity: 3,
    rating: 4.0,
    reviewCount: 12,
    ownerId: '2',
    ownerName: 'Jane Smith',
    ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    available: true,
    featured: false,
    createdAt: new Date('2023-12-10')
  },
  {
    id: '5',
    title: 'Executive PG for Professionals',
    description: 'Premium PG accommodation designed for working professionals. Features modern amenities, work-friendly environment, and excellent connectivity to major business districts.',
    address: '56 Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    price: 14000,
    deposit: 28000,
    amenities: ['WiFi', 'AC', 'TV', 'Washing Machine', 'Gym', 'Food', 'Power Backup'],
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3773581/pexels-photo-3773581.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    type: 'single',
    capacity: 1,
    rating: 4.7,
    reviewCount: 28,
    ownerId: '2',
    ownerName: 'Jane Smith',
    ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    available: true,
    featured: true,
    createdAt: new Date('2023-08-15')
  },
  {
    id: '6',
    title: 'Co-living Space with Shared Facilities',
    description: 'Modern co-living space with shared kitchen, living area, and recreational facilities. Perfect for young professionals looking for community living experience.',
    address: '90 Electronic City',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    price: 9500,
    deposit: 19000,
    amenities: ['WiFi', 'Common Kitchen', 'Recreation Room', 'Laundry', 'Housekeeping', 'Security'],
    images: [
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    type: 'shared',
    capacity: 4,
    rating: 4.4,
    reviewCount: 22,
    ownerId: '2',
    ownerName: 'Jane Smith',
    ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    available: true,
    featured: false,
    createdAt: new Date('2023-10-30')
  }
]

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  featured: [],
  isLoading: false,
  error: null,
  filters: {
    city: '',
    priceMin: 0,
    priceMax: 50000,
    type: null,
    amenities: [],
  },
  
  fetchProperties: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set({ 
        properties: mockProperties,
        featured: mockProperties.filter(p => p.featured),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: 'Failed to fetch properties', 
        isLoading: false 
      })
    }
  },
  
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
  },
  
  getPropertyById: (id) => {
    return get().properties.find(p => p.id === id)
  }
}))