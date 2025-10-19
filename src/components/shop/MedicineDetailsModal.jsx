import React from 'react';
import { ShoppingCart, Heart, Package, Calendar, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';
import toast from 'react-hot-toast';

const MedicineDetailsModal = ({ medicine, isOpen, onClose, isWishlisted, onToggleWishlist }) => {
  const { addToCart, isInCart } = useCart();
  const { language } = useLanguage();
  const [quantity, setQuantity] = React.useState(1);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    try {
      addToCart(medicine, quantity);
      toast.success(`${medicine.name} ${t('shop.addedToCart', language)}!`);
      onClose();
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(t('shop.failedToAddToCart', language));
    }
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(medicine);
    toast.success(
      isWishlisted 
        ? t('shop.removedFromWishlist', language)
        : t('shop.addedToWishlist', language)
    );
  };

  const handleViewDetails = () => {
    // Close the modal and navigate to the full medicine details page
    onClose();
    window.location.href = `/medicine/${medicine._id}`;
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('shop.medicineDetails', language)}</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
        
        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Medicine Image */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 flex items-center justify-center">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-48 sm:h-64 object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                }}
              />
            </div>
            
            {/* Medicine Details */}
            <div>
              {/* Category and Prescription Badge */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {typeof medicine.category === 'object' && medicine.category !== null 
                    ? medicine.category.name 
                    : medicine.category || 'Uncategorized'}
                </Badge>
                {medicine.prescriptionRequired && (
                  <Badge variant="outline" className="border-amber-500 text-amber-500 text-xs sm:text-sm">
                    <Shield className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    {t('shop.prescriptionRequired', language)}
                  </Badge>
                )}
                {medicine.discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white text-xs sm:text-sm">
                    {medicine.discountPercentage}% {t('shop.off', language)}
                  </Badge>
                )}
              </div>

              {/* Medicine Name */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {medicine.name}
              </h3>

              {/* Generic Name */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-1">
                {medicine.genericName}
              </p>

              {/* Company */}
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                {t('shop.by', language)} {medicine.company}
              </p>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                {medicine.discountPercentage > 0 ? (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      ৳{(medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 line-through">
                      ৳{medicine.price.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                      {t('shop.save', language)} ৳{(medicine.price - (medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100))).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    ৳{medicine.price.toFixed(2)}
                  </span>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                  {medicine.massUnit} • {t('shop.inStock', language)}: {medicine.stockQuantity} {t('shop.units', language)}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t('shop.quantity', language)}
                </h4>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-2 py-1 sm:px-3 sm:py-2"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span className="px-3 py-1 sm:px-4 sm:py-2 text-gray-900 dark:text-white text-sm sm:text-base">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={incrementQuantity}
                      className="px-2 py-1 sm:px-3 sm:py-2"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('shop.units', language)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart(medicine._id, medicine.massUnit)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">{isInCart(medicine._id, medicine.massUnit) ? t('shop.addedToCart', language) : t('shop.addToCart', language)}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={`flex-1 ${isWishlisted ? "text-red-500 border-red-500" : ""}`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="text-sm sm:text-base">{isWishlisted ? t('shop.wishlisted', language) : t('shop.addToWishlist', language)}</span>
                </Button>
              </div>

              {/* View Details Button */}
              <div className="mt-2 sm:mt-3">
                <Button
                  variant="outline"
                  onClick={handleViewDetails}
                  className="w-full"
                >
                  <span className="text-sm sm:text-base">{t('shop.viewDetails', language)}</span>
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 mr-2" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.fastDelivery', language)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 mr-2" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.genuine', language)}
                  </span>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 mr-2" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.easyReturns', language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('shop.description', language)}
            </h4>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-pre-line">
                {medicine.description || t('shop.noDescription', language)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailsModal;