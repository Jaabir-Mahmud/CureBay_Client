import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translation import

const DiscountSection = ({ medicines = [] }) => {
  const { addToCart } = useCart();
  const { language } = useLanguage(); // Use language context
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Filter medicines with discount
  const discountedMedicines = medicines.filter(medicine => medicine.discount > 0);

  if (discountedMedicines.length === 0) return null;

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
  };

  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const closeMedicineDetails = () => {
    setSelectedMedicine(null);
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.discount.specialOffers', language)}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('home.discount.description', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedMedicines.slice(0, 4).map((medicine) => (
            <Card key={medicine._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-0">
                {/* Discount Badge */}
                <Badge className="absolute top-2 right-2 z-10 bg-red-500 text-white">
                  {medicine.discount}% {t('home.discount.off', language)}
                </Badge>

                {/* Medicine Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Button 
                      onClick={() => openMedicineDetails(medicine)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
                    >
                      {t('home.discount.quickView', language)}
                    </Button>
                  </div>
                </div>

                {/* Medicine Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {medicine.company}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mt-2">
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
                      ({medicine.reviews || 12} {t('home.discount.reviews', language)})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${(medicine.price * (1 - medicine.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                        ${medicine.price.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(medicine)}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Medicine Detail Dialog */}
      <Dialog open={!!selectedMedicine} onOpenChange={closeMedicineDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{t('home.discount.productDetails', language)}</span>
              <Button variant="ghost" size="sm" onClick={closeMedicineDetails}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedMedicine && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedMedicine.image}
                  alt={selectedMedicine.name}
                  className="w-full h-64 object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMedicine.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {selectedMedicine.company}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedMedicine.rating || 4.5)
                            ? 'fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({selectedMedicine.reviews || 12} {t('home.discount.reviews', language)})
                  </span>
                </div>
                
                {/* Price */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${(selectedMedicine.price * (1 - selectedMedicine.discount / 100)).toFixed(2)}
                    </span>
                    {selectedMedicine.discount > 0 && (
                      <>
                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through ml-3">
                          ${selectedMedicine.price.toFixed(2)}
                        </span>
                        <Badge className="ml-3 bg-red-500 text-white">
                          {selectedMedicine.discount}% {t('home.discount.off', language)}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('home.discount.descriptionTitle', language)}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedMedicine.description || t('home.discount.noDescription', language)}
                  </p>
                </div>
                
                {/* Add to Cart Button */}
                <div className="mt-8">
                  <Button
                    onClick={() => handleAddToCart(selectedMedicine)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('home.discount.addToCart', language)}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DiscountSection;