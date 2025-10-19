import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Calendar, Shield, Truck, RotateCcw, Plus, Minus, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import toast from 'react-hot-toast';
import SEOHelmet from '../components/SEOHelmet';
import { createApiUrl } from '../lib/utils';

const MedicineDetailsPage = () => {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const response = await fetch(createApiUrl(`/api/medicines/${medicineId}`));
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Medicine not found');
          }
          throw new Error('Failed to fetch medicine details');
        }
        
        const data = await response.json();
        setMedicine(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching medicine:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (medicineId) {
      fetchMedicine();
    }
  }, [medicineId]);

  const handleAddToCart = () => {
    if (!medicine) return;
    
    try {
      addToCart(medicine, quantity);
      toast.success(`${medicine.name} ${t('shop.addedToCart', language)}!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(t('shop.failedToAddToCart', language));
    }
  };

  const handleBuyNow = () => {
    if (!medicine) return;
    
    try {
      addToCart(medicine, quantity);
      navigate('/checkout');
    } catch (err) {
      console.error('Error buying now:', err);
      toast.error(t('shop.failedToProceedToCheckout', language));
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted 
        ? t('shop.removedFromWishlist', language)
        : t('shop.addedToWishlist', language)
    );
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                {t('shop.loadingMedicineDetails', language)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || t('shop.medicineNotFound', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {error 
                ? `${t('shop.error', language)}: ${error}`
                : t('shop.medicineNotFoundMessage', language)
              }
            </p>
            <div className="space-x-4">
              <Link to="/shop">
                <Button>{t('shop.browseAllMedicines', language)}</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">{t('common.backToHome', language)}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format category name for display
  const getCategoryName = (category) => {
    if (typeof category === 'object' && category !== null) {
      return category.name || 'Uncategorized';
    }
    return category || 'Uncategorized';
  };

  return (
    <>
      <SEOHelmet
        title={`${medicine.name} - CureBay Online Pharmacy`}
        description={medicine.description || `Buy ${medicine.name} online at best price. Fast delivery and genuine products.`}
        keywords={`${medicine.name}, ${medicine.company}, buy ${medicine.name} online, pharmacy, healthcare`}
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back', language)}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Medicine Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x600/cccccc/ffffff?text=Medicine+Image';
                  }}
                />
              </div>
            </div>

            {/* Medicine Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              {/* Category and Prescription Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {getCategoryName(medicine.category)}
                </Badge>
                {medicine.prescriptionRequired && (
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    <Shield className="w-3 h-3 mr-1" />
                    {t('shop.prescriptionRequired', language)}
                  </Badge>
                )}
                {medicine.discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {medicine.discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Medicine Name */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {medicine.name}
              </h1>

              {/* Generic Name */}
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                {medicine.genericName}
              </p>

              {/* Company */}
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                by {medicine.company}
              </p>

              {/* Price */}
              <div className="mb-6">
                {medicine.discountPercentage > 0 ? (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ৳{(medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through ml-3">
                      ৳{medicine.price.toFixed(2)}
                    </span>
                    <span className="ml-3 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {t('shop.save', language)} ৳{(medicine.price - (medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100))).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ৳{medicine.price.toFixed(2)}
                  </span>
                )}
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {medicine.massUnit} • In stock: {medicine.stockQuantity} units
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-3 py-2"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={incrementQuantity}
                      className="px-3 py-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart(medicine._id, medicine.massUnit)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart(medicine._id, medicine.massUnit) ? t('shop.addedToCart', language) : t('shop.addToCart', language)}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {t('shop.buyNow', language)}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={isWishlisted ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-cyan-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.fastDelivery', language)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-cyan-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.genuine', language)}
                  </span>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="w-5 h-5 text-cyan-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.easyReturns', language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('shop.description', language)}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {medicine.description || t('shop.noDescription', language)}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                {t('shop.productInformation', language)}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.category', language)}</span>
                  <span className="text-gray-900 dark:text-white">
                    {getCategoryName(medicine.category)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.brand', language)}</span>
                  <span className="text-gray-900 dark:text-white">
                    {medicine.company}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.dosageForm', language)}</span>
                  <span className="text-gray-900 dark:text-white">
                    {medicine.massUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.stockStatus', language)}</span>
                  <span className={`font-medium ${medicine.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {medicine.inStock ? t('shop.inStock', language) : t('shop.outOfStock', language)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {t('shop.storageExpiry', language)}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.storage', language)}</span>
                  <span className="text-gray-900 dark:text-white">
                    {t('shop.storeInCoolDryPlace', language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.shelfLife', language)}</span>
                  <span className="text-gray-900 dark:text-white">
                    {t('shop.twentyFourMonths', language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('shop.countryOfOrigin', language)}</span>
                  <span className="text-gray-900 dark:text-white">
                    {t('shop.bangladesh', language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Medicine Information Sections */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('shop.medicineInformation', language)}
            </h2>
            
            <div className="space-y-8">
              {/* Indications */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.indications', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              {/* Pharmacology */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.pharmacology', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                </p>
              </div>
              
              {/* Dosage & Administration */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.dosageAdministration', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
                </p>
              </div>
              
              {/* Interaction */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.interaction', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              
              {/* Side Effects */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.sideEffects', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
              
              {/* Pregnancy & Lactation */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.pregnancyLactation', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                </p>
              </div>
              
              {/* Precautions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.precautions', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
              </div>
              
              {/* Overdose Effects */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.overdoseEffects', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>
              </div>
              
              {/* Therapeutic Class */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.therapeuticClass', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
                </p>
              </div>
              
              {/* Storage Conditions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
                  {t('shop.storageConditions', language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineDetailsPage;