import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Property } from '../../lib/types'
import { formatPrice } from '../../lib/utils'
import { Card, CardContent, CardFooter } from '../ui/card'
import { MapPin, Star, Wifi, Tv, Coffee } from 'lucide-react'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const {
    id,
    title,
    city,
    price,
    images,
    rating,
    reviewCount,
    amenities,
    type,
  } = property

  // Function to get appropriate icon for an amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />
      case 'tv':
        return <Tv className="h-3 w-3" />
      case 'food':
        return <Coffee className="h-3 w-3" />
      default:
        return null
    }
  }

  // Take only first 3 amenities
  const displayAmenities = amenities.slice(0, 3)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/property/${id}`}>
        <Card className="overflow-hidden h-full">
          <div className="relative overflow-hidden h-48">
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
              <div className="flex items-center space-x-1 text-accent-500">
                <Star className="fill-current h-4 w-4" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-xs text-gray-500">({reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center mt-2 text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{city}</span>
            </div>

            <div className="mt-3">
              <span className="text-xl font-bold text-gray-900">{formatPrice(price)}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
          </CardContent>

          <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {displayAmenities.map((amenity, index) => (
                <div 
                  key={index} 
                  className="badge badge-primary flex items-center space-x-1"
                >
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {amenities.length > 3 && (
                <div className="badge badge-secondary">
                  +{amenities.length - 3}
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}