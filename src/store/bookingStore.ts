import { create } from 'zustand'
import { Booking } from '../lib/types'
import { generateBookingId } from '../lib/utils'

interface BookingState {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  currentBooking: Booking | null
  fetchUserBookings: (userId: string) => Promise<void>
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>
  cancelBooking: (bookingId: string) => Promise<void>
  setCurrentBooking: (booking: Booking | null) => void
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: 'BK123456',
    propertyId: '1',
    propertyName: 'Modern PG with Balcony',
    propertyImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    userId: '1',
    userName: 'John Doe',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-12-01'),
    totalAmount: 12000,
    status: 'completed',
    paymentStatus: 'completed',
    paymentMethod: 'Credit Card',
    createdAt: new Date('2023-10-15')
  },
  {
    id: 'BK234567',
    propertyId: '3',
    propertyName: 'Premium Single Room PG',
    propertyImage: 'https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    userId: '1',
    userName: 'John Doe',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-01'),
    totalAmount: 15000,
    status: 'confirmed',
    paymentStatus: 'completed',
    paymentMethod: 'UPI',
    createdAt: new Date('2023-12-15')
  }
]

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  currentBooking: null,
  
  fetchUserBookings: async (userId) => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userBookings = mockBookings.filter(b => b.userId === userId)
      
      set({ 
        bookings: userBookings,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: 'Failed to fetch bookings', 
        isLoading: false 
      })
    }
  },
  
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBooking: Booking = {
        ...bookingData,
        id: generateBookingId(),
        createdAt: new Date(),
      }
      
      mockBookings.push(newBooking)
      
      set(state => ({ 
        bookings: [...state.bookings, newBooking],
        isLoading: false,
        currentBooking: newBooking
      }))
      
      return newBooking
    } catch (error) {
      set({ 
        error: 'Failed to create booking', 
        isLoading: false 
      })
      throw error
    }
  },
  
  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const bookingIndex = mockBookings.findIndex(b => b.id === bookingId)
      
      if (bookingIndex !== -1) {
        mockBookings[bookingIndex].status = 'cancelled'
        
        set(state => ({
          bookings: state.bookings.map(b => 
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
          isLoading: false
        }))
      } else {
        throw new Error('Booking not found')
      }
    } catch (error) {
      set({ 
        error: 'Failed to cancel booking', 
        isLoading: false 
      })
      throw error
    }
  },
  
  setCurrentBooking: (booking) => {
    set({ currentBooking: booking })
  }
}))