import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate import
import { ShoppingCart, X, Eye } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import { createApiUrl } from '../lib/utils';

const DiscountSection = () => {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate(); // Add navigate hook
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized fetch function
  const fetchDiscountedMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Changed limit from 12 back to 8 as requested
      const response = await fetch(createApiUrl('/api/medicines/discounted?limit=8'));
      if (!response.ok) {
        throw new Error(`Failed to fetch discounted medicines: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate and sanitize medicine data
      if (data && Array.isArray(data.medicines)) {
        const sanitizedMedicines = data.medicines.map(medicine => ({
          ...medicine,
          _id: typeof medicine._id === 'string' ? medicine._id : '',
          name: typeof medicine.name === 'string' ? medicine.name : 'Unknown Medicine',
          company: typeof medicine.company === 'string' ? medicine.company : 'Unknown Company',
          description: typeof medicine.description === 'string' ? medicine.description : '',
          image: typeof medicine.image === 'string' ? medicine.image : 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine',
          price: typeof medicine.price === 'number' ? medicine.price : 0,
          discountPercentage: typeof medicine.discountPercentage === 'number' ? medicine.discountPercentage : 0,
          finalPrice: typeof medicine.finalPrice === 'number' ? medicine.finalPrice : 
            (typeof medicine.price === 'number' && typeof medicine.discountPercentage === 'number' ? 
              medicine.price * (1 - medicine.discountPercentage / 100) : 0)
        }));
        
        setMedicines(sanitizedMedicines);
      } else {
        setMedicines([]);
      }
    } catch (error) {
      console.error('Error fetching discounted medicines:', error);
      setError(error.message);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch discounted medicines with better error handling
  useEffect(() => {
    fetchDiscountedMedicines();
  }, [fetchDiscountedMedicines]);

  // Memoized loading skeleton
  const loadingSkeleton = useMemo(() => (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div className="text-left">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Show only 8 loading skeletons */}
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <CardContent className="p-0">
                <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-10"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  ), []);

  // Memoized error component
  const errorComponent = useMemo(() => (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('home.discount.specialOffers', language)}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('home.discount.description', language)}
            </p>
          </div>
          <Button
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => navigate('/discounts')} // Redirect to discounts page
          >
            {t('home.discount.viewAllOffers', language)}
          </Button>
        </div>
        
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">
            {t('home.discount.error', language) || 'Failed to load special offers'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {error}
          </p>
        </div>
      </div>
    </section>
  ), [language, error, navigate]);

  // Memoized no offers component
  const noOffersComponent = useMemo(() => (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('home.discount.specialOffers', language)}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('home.discount.description', language)}
            </p>
          </div>
          <Button
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => navigate('/discounts')} // Redirect to discounts page
          >
            {t('home.discount.viewAllOffers', language)}
          </Button>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('home.discount.noOffers', language) || 'No special offers available at the moment'}
          </p>
        </div>
      </div>
    </section>
  ), [language, navigate]);

  const handleAddToCart = useCallback((medicine) => {
    // Validate medicine before adding to cart
    if (!medicine || typeof medicine !== 'object') {
      console.error('Invalid medicine data');
      return;
    }
    
    addToCart(medicine);
  }, [addToCart]);

  const openMedicineDetails = useCallback((medicine) => {
    // Validate medicine before opening details
    if (!medicine || typeof medicine !== 'object') {
      console.error('Invalid medicine data');
      return;
    }
    
    setSelectedMedicine(medicine);
  }, []);

  const closeMedicineDetails = useCallback(() => {
    setSelectedMedicine(null);
  }, []);

  // Memoized main content
  const mainContent = useMemo(() => (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('home.discount.specialOffers', language)}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('home.discount.description', language)}
            </p>
          </div>
          <Button
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl whitespace-nowrap"
            onClick={() => navigate('/discounts')} // Redirect to discounts page
          >
            {t('home.discount.viewAllOffers', language)}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Show only first 8 medicines */}
          {medicines.slice(0, 8).map((medicine) => {
            // Validate medicine data
            if (!medicine || typeof medicine !== 'object') return null;
            
            return (
              <Card key={medicine._id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 rounded-2xl bg-white dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="p-0">
                  {/* Discount Badge */}
                  <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg rounded-full px-3 py-1.5 text-sm font-bold">
                    {medicine.discountPercentage}% {language === 'BN' ? 'ছাড়' : 'OFF'}
                  </Badge>

                  {/* Medicine Image */}
                  <div className="relative h-52 overflow-hidden rounded-t-2xl">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback image on error
                        e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                      <Button 
                        onClick={() => openMedicineDetails(medicine)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-xl transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {t('home.discount.quickView', language)}
                      </Button>
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg mb-1">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 mb-3">
                      {medicine.company}
                    </p>
                    {/* Rating */}
                    {/* <div className="flex items-center mb-3">
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
                    </div> */}
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ৳{(medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                          ৳{medicine.price.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(medicine)}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
                        aria-label={`Add ${medicine.name} to cart`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Medicine Detail Dialog */}
      <Dialog open={!!selectedMedicine} onOpenChange={closeMedicineDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {t('home.discount.productDetails', language)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMedicine && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-center">
                <img
                  src={selectedMedicine.image}
                  alt={selectedMedicine.name}
                  className="w-full h-64 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback image on error
                    e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                  }}
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMedicine.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {selectedMedicine.company}
                </p>
                
                {/* Rating */}
                {/* <div className="flex items-center mt-4">
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
                </div> */}
                
                {/* Price */}
                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      ৳{(selectedMedicine.finalPrice || selectedMedicine.price * (1 - selectedMedicine.discountPercentage / 100)).toFixed(2)}
                    </span>
                    {selectedMedicine.discountPercentage > 0 && (
                      <>
                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                          ৳{selectedMedicine.price.toFixed(2)}
                        </span>
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg rounded-full px-2 py-1 text-xs sm:text-sm font-bold">
                          {selectedMedicine.discountPercentage}% {t('home.discount.off', language)}
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
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {selectedMedicine.description || t('home.discount.noDescription', language)}
                  </p>
                </div>
                
                {/* Add to Cart Button */}
                <div className="mt-8">
                  <Button
                    onClick={() => handleAddToCart(selectedMedicine)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-3 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
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
  ), [medicines, language, selectedMedicine, openMedicineDetails, handleAddToCart, closeMedicineDetails, navigate]);

  if (loading) {
    return loadingSkeleton;
  }

  if (error) {
    return errorComponent;
  }

  if (medicines.length === 0) {
    return noOffersComponent;
  }

  return mainContent;
};

export default React.memo(DiscountSection);