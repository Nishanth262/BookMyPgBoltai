import { create } from 'zustand'
import { User } from '../lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'owner',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'admin',
    createdAt: new Date(),
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === email)
    
    if (user) {
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      })
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      set({ isLoading: false })
      throw new Error('Invalid credentials')
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const existingUser = mockUsers.find(u => u.email === email)
    
    if (existingUser) {
      set({ isLoading: false })
      throw new Error('Email already in use')
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role: 'user',
      createdAt: new Date(),
    }
    
    mockUsers.push(newUser)
    
    set({ 
      user: newUser, 
      isAuthenticated: true, 
      isLoading: false 
    })
    localStorage.setItem('user', JSON.stringify(newUser))
  },
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    })
    localStorage.removeItem('user')
  },
}))