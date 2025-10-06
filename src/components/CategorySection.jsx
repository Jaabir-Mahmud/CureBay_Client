import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translation import

const CategorySection = ({ category }) => {
  const { language } = useLanguage(); // Use language context
  
  if (!category) return null;

  // Get the first 4 medicines for display
  const displayMedicines = category.medicines?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {category.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {category.description}
          </p>
        </div>
        <Link 
          to={`/category/${encodeURIComponent(category.name)}`}
          className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium flex items-center"
        >
          {t('home.category.viewAll', language)}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMedicines.map((medicine) => (
          <Card key={medicine._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-0">
              <Link to={`/medicine/${medicine._id}`} className="block">
                {/* Medicine Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {medicine.discountPercentage > 0 && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                      {medicine.discountPercentage}% {t('home.category.off', language)}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Medicine Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg mb-1">
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {medicine.company}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mt-3">
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
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({medicine.reviews || 12}) {t('home.discount.reviews', language)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {medicine.discountPercentage > 0 ? (
                        <>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ৳{(medicine.finalPrice || medicine.price * (1 - medicine.discountPercentage / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                            ৳{medicine.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ৳{medicine.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;