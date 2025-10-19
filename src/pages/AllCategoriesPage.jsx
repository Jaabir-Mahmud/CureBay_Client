import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Pill, Heart, Circle, Syringe, Stethoscope, Tag, Search, X } from 'lucide-react';
import SEOHelmet from '../components/SEOHelmet';
import { createApiUrl } from '../lib/utils';

const AllCategoriesPage = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all categories with better error handling
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['all-categories'],
    queryFn: async () => {
      const response = await fetch(createApiUrl('/api/categories'));
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      
      // Validate and sanitize category data
      if (!Array.isArray(data)) {
        throw new Error('Invalid categories data format');
      }
      
      return data.map(category => ({
        ...category,
        name: typeof category.name === 'string' ? category.name : 'Unknown Category',
        description: typeof category.description === 'string' ? category.description : '',
        // If backend returns a nested medicines array, use its length as the count.
        // Otherwise fall back to a numeric count property or 0.
        count: Array.isArray(category.medicines)
          ? category.medicines.length
          : (typeof category.medicineCount === 'number' ? category.medicineCount : 
             (typeof category.count === 'number' ? category.count : 0)),
        icon: typeof category.icon === 'string' ? category.icon : 'Pill',
        color: typeof category.color === 'string' ? category.color : 'cyan',
        image: typeof category.image === 'string' ? category.image : null
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    
    const term = searchTerm.toLowerCase().trim();
    return categories.filter(category => 
      category.name.toLowerCase().includes(term) || 
      category.description.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  // Map icon names to actual components
  const iconMap = {
    Pill: Pill,
    Heart: Heart,
    Circle: Circle,
    Syringe: Syringe,
    Stethoscope: Stethoscope,
    Tag: Tag
  };

  // Map color names to Tailwind classes
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-200 dark:border-cyan-700',
      icon: 'bg-cyan-100 dark:bg-cyan-900/40',
      text: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'shadow-cyan-100/40 dark:shadow-cyan-900/40'
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-700',
      icon: 'bg-pink-100 dark:bg-pink-900/40',
      text: 'text-pink-600 dark:text-pink-400',
      shadow: 'shadow-pink-100/40 dark:shadow-pink-900/40'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      icon: 'bg-green-100 dark:bg-green-900/40',
      text: 'text-green-600 dark:text-green-400',
      shadow: 'shadow-green-100/40 dark:shadow-green-900/40'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      icon: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-600 dark:text-red-400',
      shadow: 'shadow-red-100/40 dark:shadow-red-900/40'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      icon: 'bg-orange-100 dark:bg-orange-900/40',
      text: 'text-orange-600 dark:text-orange-400',
      shadow: 'shadow-orange-100/40 dark:shadow-orange-900/40'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'bg-gray-100 dark:bg-gray-900/40',
      text: 'text-gray-600 dark:text-gray-400',
      shadow: 'shadow-gray-100/40 dark:shadow-gray-900/40'
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('allCategories.backToHome', language)}
            </Link>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <div className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-12 h-12"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8"></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('allCategories.backToHome', language)}
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('allCategories.errorTitle', language)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('allCategories.errorMessage', language)}
            </p>
            <Link to="/">
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                {t('allCategories.goBackHome', language)}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title={t('allCategories.seo.title', language)}
        description={t('allCategories.seo.description', language)}
        keywords={t('allCategories.seo.keywords', language)}
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 mr-6">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t('allCategories.backToHome', language)}
              </Link>
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('allCategories.title', language)}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('allCategories.description', language).replace('{count}', filteredCategories.length)}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t('admin.categories.search', language)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm 
                  ? t('admin.categories.noCategories', language) 
                  : t('allCategories.noCategories', language)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm 
                  ? t('shop.tryAdjustingSearch', language) 
                  : t('allCategories.checkBackLater', language)}
              </p>
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition duration-300"
                >
                  {t('common.clearSearch', language) || 'Clear Search'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => {
                // Validate category data
                if (!category || typeof category !== 'object') return null;
                
                const IconComponent = iconMap[category.icon] || Pill;
                const colorClasses = colorMap[category.color] || colorMap.cyan;
                return (
                  <Link 
                    key={category._id} 
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="block group"
                  >
                    <Card className={`${colorClasses.bg} ${colorClasses.border} border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${colorClasses.shadow} rounded-2xl overflow-hidden flex flex-col h-full`}>
                      {/* Thumbnail Image */}
                      {category.image && (
                        <div className="relative h-40 w-full overflow-hidden">
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              // Fallback image on error
                              e.target.src = 'https://placehold.co/400x200/cccccc/ffffff?text=Category';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        </div>
                      )}
                      
                      <CardContent className="p-6 flex-grow">
                        <div className="flex items-start justify-between">
                          <div className={`w-14 h-14 ${colorClasses.icon} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${colorClasses.shadow} transform transition duration-300 group-hover:scale-110`}>
                            <IconComponent className={`w-7 h-7 ${colorClasses.text}`} />
                          </div>
                          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-sm font-bold px-3 py-1.5 rounded-full shadow-md animate-fade-in">
                            {category.count || 0} {t('allCategories.medicines', language)}
                          </div>
                        </div>
                        <h3 className="font-extrabold text-2xl text-gray-900 dark:text-white mt-5 mb-3 tracking-tight animate-fade-in group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base line-clamp-2 animate-fade-in">
                          {category.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCategoriesPage;