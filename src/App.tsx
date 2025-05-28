import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import HomePage from './pages/HomePage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import LoginPage from './pages/LoginPage'

// Auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}

function App() {
  const { isAuthenticated } = useAuthStore()
  
  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      // Here we would normally validate the user token
      // but for this demo we'll just use the stored user
    }
  }, [])
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* These routes would be implemented in a full app */}
        <Route path="/register" element={<LoginPage />} />
        <Route path="/properties" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />
        <Route path="/search" element={<HomePage />} />
        
        {/* Protected routes */}
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App