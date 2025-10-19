import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, ArrowLeft, Calendar, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Search, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import SEOHelmet from '../components/SEOHelmet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { createApiUrl } from '../lib/utils';

const DiscountsPage = () => {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount'); // discount, price, name
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all discounted medicines
  useEffect(() => {
    const fetchDiscountedMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch(createApiUrl('/api/medicines/discounted?limit=100'));
        if (!response.ok) {
          throw new Error('Failed to fetch discounted medicines');
        }
        
        const data = await response.json();
        
        // Validate and sanitize medicine data
        if (data && Array.isArray(data.medicines)) {
          // First filter out any invalid medicines
          const validMedicines = data.medicines.filter(medicine => 
            medicine && medicine._id && medicine.name
          );
          
          const sanitizedMedicines = validMedicines.map(medicine => ({
            ...medicine,
            _id: typeof medicine._id === 'string' ? medicine._id : '',
            name: typeof medicine.name === 'string' ? medicine.name : 'Unknown Medicine',
            company: typeof medicine.company === 'string' ? medicine.company : 'Unknown Company',
            description: typeof medicine.description === 'string' ? medicine.description : '',
            image: typeof medicine.image === 'string' ? medicine.image : 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine',
            price: typeof medicine.price === 'number' ? medicine.price : 0,
            discountPercentage: typeof medicine.discountPercentage === 'number' ? medicine.discountPercentage : 0,
            discountStartDate: medicine.discountStartDate || null,
            discountEndDate: medicine.discountEndDate || null,
            finalPrice: typeof medicine.finalPrice === 'number' ? medicine.finalPrice : 
              (typeof medicine.price === 'number' && typeof medicine.discountPercentage === 'number' ? 
                medicine.price * (1 - medicine.discountPercentage / 100) : 0)
          }));
          
          setMedicines(sanitizedMedicines);
          setFilteredMedicines(sanitizedMedicines);
        } else {
          setMedicines([]);
          setFilteredMedicines([]);
        }
      } catch (error) {
        console.error('Error fetching discounted medicines:', error);
        setMedicines([]);
        setFilteredMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedMedicines();
  }, []);

  // Filter and sort medicines
  useEffect(() => {
    let result = [...medicines];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(medicine => 
        medicine.name.toLowerCase().includes(term) ||
        medicine.company.toLowerCase().includes(term) ||
        medicine.genericName.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'price':
        result.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredMedicines(result);
  }, [medicines, searchTerm, sortBy]);

  const handleAddToCart = (medicine) => {
    // Validate medicine before adding to cart
    if (!medicine || typeof medicine !== 'object') {
      console.error('Invalid medicine data');
      return;
    }
    
    addToCart(medicine);
  };

  // Function to check if discount is currently active
  const isDiscountActive = (medicine) => {
    const currentDate = new Date();
    const startDate = medicine.discountStartDate ? new Date(medicine.discountStartDate) : null;
    const endDate = medicine.discountEndDate ? new Date(medicine.discountEndDate) : null;
    
    const isStarted = !startDate || startDate <= currentDate;
    const isEnded = endDate && endDate < currentDate;
    
    return isStarted && !isEnded;
  };

  // Open medicine details modal
  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  // Close medicine details modal
  const closeMedicineDetails = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="flex items-center mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back', language)}
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('discounts.title', language)}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
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
      </div>
    );
  }

  return (
    <>
      <SEOHelmet 
        title={t('seo.discounts.title', language)}
        description={t('seo.discounts.description', language)}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center">
              <Button 
                onClick={() => navigate(-1)} 
                variant="outline" 
                className="flex items-center mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back', language)}
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {t('discounts.title', language)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t('discounts.subtitle', language)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('discounts.searchPlaceholder', language)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="discount">{t('discounts.sort.discount', language)}</option>
                  <option value="price">{t('discounts.sort.price', language)}</option>
                  <option value="name">{t('discounts.sort.name', language)}</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🏷️</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {t('discounts.noResults.title', language)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? t('discounts.noResults.search', language) 
                  : t('discounts.noResults.general', language)}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/shop')}>
                  {t('discounts.noResults.browse', language)}
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {t('discounts.showingResults', language).replace('{count}', filteredMedicines.length)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMedicines.map((medicine) => (
                  <Card key={medicine._id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 rounded-2xl bg-white dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardContent className="p-0">
                      {/* Discount Badge */}
                      <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg rounded-full px-3 py-1.5 text-sm font-bold">
                        {medicine.discountPercentage}% {language === 'BN' ? 'ছাড়' : 'OFF'}
                        {medicine.discountStartDate && !isDiscountActive(medicine) && (
                          <span className="block text-xs mt-1">
                            {new Date(medicine.discountStartDate).toLocaleDateString()}
                          </span>
                        )}
                      </Badge>

                      {/* Medicine Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                          <Button 
                            onClick={() => openMedicineDetails(medicine)}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-xl transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {t('discounts.quickView', language)}
                          </Button>
                        </div>
                      </div>

                      {/* Medicine Info */}
                      <div className="p-4">
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
                            {medicine.discountEndDate && isDiscountActive(medicine) && (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>
                                  Ends: {new Date(medicine.discountEndDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
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
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Medicine Detail Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                    e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMedicine.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {selectedMedicine.genericName}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  by {selectedMedicine.company}
                </p>
                
                {/* Rating */}
                {/* <div className="flex items-center mt-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {selectedMedicine.massUnit} • In stock: {selectedMedicine.stockQuantity} units
                  </p>
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
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      handleAddToCart(selectedMedicine);
                      closeMedicineDetails();
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('home.discount.addToCart', language)}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <Link to={`/medicine/${selectedMedicine._id}`}>
                      {t('home.discount.productDetails', language)}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiscountsPage;