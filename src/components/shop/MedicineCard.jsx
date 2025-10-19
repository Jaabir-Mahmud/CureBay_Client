import React from 'react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';
import toast from 'react-hot-toast';

const MedicineCard = ({ medicine, onQuickView, onToggleWishlist, isWishlisted, showOnlyEyeIcon = false }) => {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    try {
      addToCart(medicine, 1);
      toast.success(`${medicine.name} ${t('shop.addedToCart', language)}!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(t('shop.failedToAddToCart', language));
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView(medicine);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist(medicine);
  };

  const handleCardClick = () => {
    // Navigate to medicine details page
    window.location.href = `/medicine/${medicine._id}`;
  };

  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
      onClick={handleCardClick}
    >
      {/* Medicine Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
          }}
        />
        {medicine.discountPercentage > 0 && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
            {medicine.discountPercentage}% OFF
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons - Show only Eye icon if showOnlyEyeIcon is true */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {showOnlyEyeIcon ? (
            // Only show Eye icon
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 border-white shadow-xl"
              onClick={handleQuickView}
            >
              <Eye className="w-4 h-4" />
            </Button>
          ) : (
            // Show all icons (original behavior)
            <>
              <Button 
                size="sm" 
                className="bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-xl"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 border-white shadow-xl"
                onClick={handleQuickView}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className={`bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 border-white shadow-xl ${
                  isWishlisted 
                    ? "text-red-500 border-red-500" 
                    : "text-gray-900 dark:text-white"
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Medicine Info */}
      <div className="p-4">
        {/* Category */}
        <Badge variant="secondary" className="mb-2">
          {typeof medicine.category === 'object' && medicine.category !== null 
            ? medicine.category.name 
            : medicine.category || 'Uncategorized'}
        </Badge>
        
        {/* Medicine Name */}
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg mb-1">
          {medicine.name}
        </h3>
        
        {/* Company */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">
          by {medicine.company}
        </p>

        {/* Price */}
        <div className="mb-4">
          {medicine.discountPercentage > 0 ? (
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{(medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100)).toFixed(2)}
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

        {/* Action Button */}
        <Button 
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={handleAddToCart}
          disabled={isInCart(medicine._id, medicine.massUnit)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart(medicine._id, medicine.massUnit) ? t('shop.addedToCart', language) : t('shop.addToCart', language)}
        </Button>
      </div>
    </div>
  );
};

export default MedicineCard;