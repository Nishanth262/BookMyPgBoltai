import { create } from 'zustand'
import { User } from '../lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  otpSent: boolean
  otpPhone: string | null
  sendLoginOtp: (phone: string) => Promise<void>
  verifyLoginOtp: (phone: string, otp: string) => Promise<void>
  sendSignupOtp: (phone: string) => Promise<void>
  verifySignupOtp: (name: string, email: string, phone: string, otp: string, role?: string) => Promise<void>
  resendOtp: (phone: string, type: 'LOGIN' | 'SIGNUP') => Promise<void>
  logout: () => void
  clearOtpState: () => void
}

const API_BASE_URL = 'http://localhost:5000/api'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  otpSent: false,
  otpPhone: null,
  
  sendLoginOtp: async (phone: string) => {
    set({ isLoading: true })
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }
      
      set({ 
        otpSent: true, 
        otpPhone: phone, 
        isLoading: false 
      })
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },
  
  verifyLoginOtp: async (phone: string, otp: string) => {
    set({ isLoading: true })
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP')
      }
      
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false,
        otpSent: false,
        otpPhone: null
      })
      
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },
  
  sendSignupOtp: async (phone: string) => {
    set({ isLoading: true })
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }
      
      set({ 
        otpSent: true, 
        otpPhone: phone, 
        isLoading: false 
      })
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },
  
  verifySignupOtp: async (name: string, email: string, phone: string, otp: string, role = 'USER') => {
    set({ isLoading: true })
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, otp, role }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP')
      }
      
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false,
        otpSent: false,
        otpPhone: null
      })
      
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },
  
  resendOtp: async (phone: string, type: 'LOGIN' | 'SIGNUP') => {
    set({ isLoading: true })
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, type }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP')
      }
      
      set({ isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false,
      otpSent: false,
      otpPhone: null
    })
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
  
  clearOtpState: () => {
    set({ 
      otpSent: false, 
      otpPhone: null 
    })
  }
}))