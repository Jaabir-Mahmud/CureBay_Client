import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCart } from '../../contexts/CartContext';

const MedicineCard = ({ medicine }) => {
  const { addToCart, isInCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(medicine);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Format category name for display
  const getCategoryName = (category) => {
    if (typeof category === 'object' && category !== null) {
      return category.name || 'Uncategorized';
    }
    return category || 'Uncategorized';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        {/* Medicine Image */}
        <Link to={`/medicine/${medicine._id}`}>
          <div className="h-48 overflow-hidden">
            <img
              src={medicine.image}
              alt={medicine.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Discount Badge */}
        {medicine.discountPercentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            {medicine.discountPercentage}% OFF
          </Badge>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 left-2 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {getCategoryName(medicine.category)}
          </Badge>
          {medicine.prescriptionRequired && (
            <Badge variant="outline" className="text-xs border-amber-500 text-amber-500">
              Rx Required
            </Badge>
          )}
        </div>

        {/* Medicine Name */}
        <Link to={`/medicine/${medicine._id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {medicine.name}
          </h3>
        </Link>

        {/* Company */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
          by {medicine.company}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(medicine.rating || 4.5)
                    ? 'fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({medicine.reviews || 12})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          {medicine.discountPercentage > 0 ? (
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{(medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                ৳{medicine.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ৳{medicine.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isInCart(medicine._id, medicine.massUnit)}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart(medicine._id, medicine.massUnit) ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default MedicineCard;