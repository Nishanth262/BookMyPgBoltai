import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PropertyType } from '../../lib/types'
import { 
  Search, 
  MapPin, 
  Users, 
  Banknote 
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const PropertySearch: React.FC = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000])
  const [roomType, setRoomType] = useState<PropertyType | ''>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (location) params.append('city', location)
    if (roomType) params.append('type', roomType)
    if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString())
    if (priceRange[1] < 25000) params.append('priceMax', priceRange[1].toString())
    
    navigate({
      pathname: '/properties',
      search: params.toString()
    })
  }

  const roomTypes: { value: PropertyType | '', label: string }[] = [
    { value: '', label: 'Any Type' },
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Sharing' },
    { value: 'triple', label: 'Triple Sharing' },
    { value: 'shared', label: 'Shared' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 -mt-12 relative z-10 mx-4 lg:mx-auto max-w-5xl">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary-500" />
              Location
            </label>
            <Input
              type="text"
              placeholder="Any city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="h-4 w-4 mr-1 text-primary-500" />
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as PropertyType | '')}
              className="input"
            >
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Banknote className="h-4 w-4 mr-1 text-primary-500" />
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="25000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                placeholder="Min"
                className="w-full"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                min="0"
                max="50000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                placeholder="Max"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-end">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}