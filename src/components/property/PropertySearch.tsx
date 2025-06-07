import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PropertyType } from '../../lib/types'
import { INDIAN_STATES, getDistrictsByStateId } from '../../data/locations'
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
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000])
  const [roomTypes, setRoomTypes] = useState<PropertyType[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (selectedState) params.append('stateId', selectedState)
    if (selectedDistrict) params.append('districtId', selectedDistrict)
    if (roomTypes.length > 0) params.append('roomTypes', roomTypes.join(','))
    if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString())
    if (priceRange[1] < 25000) params.append('priceMax', priceRange[1].toString())
    
    navigate({
      pathname: '/properties',
      search: params.toString()
    })
  }

  const handleRoomTypeChange = (roomType: PropertyType, checked: boolean) => {
    if (checked) {
      setRoomTypes(prev => [...prev, roomType])
    } else {
      setRoomTypes(prev => prev.filter(type => type !== roomType))
    }
  }

  const availableDistricts = selectedState ? getDistrictsByStateId(selectedState) : []

  const roomTypeOptions: { value: PropertyType, label: string }[] = [
    { value: 'SINGLE', label: 'Single Sharing' },
    { value: 'DOUBLE', label: '2 Sharing' },
    { value: 'TRIPLE', label: '3 Sharing' },
    { value: 'QUAD', label: '4 Sharing' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 -mt-12 relative z-10 mx-4 lg:mx-auto max-w-6xl">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* State Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary-500" />
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setSelectedDistrict('') // Reset district when state changes
              }}
              className="input"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary-500" />
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="input"
              disabled={!selectedState}
            >
              <option value="">Select District</option>
              {availableDistricts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Types */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="h-4 w-4 mr-1 text-primary-500" />
              Room Types
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {roomTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomTypes.includes(option.value)}
                    onChange={(e) => handleRoomTypeChange(option.value, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Banknote className="h-4 w-4 mr-1 text-primary-500" />
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="50000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                placeholder="Min"
                className="w-full text-sm"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 25000])}
                placeholder="Max"
                className="w-full text-sm"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search PGs
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}