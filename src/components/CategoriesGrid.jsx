import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Pill, Heart, Circle, Syringe, Stethoscope, Tag } from 'lucide-react';

const CategoriesGrid = () => {
  const { language } = useLanguage();

  // Fetch all categories with better error handling
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
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
        count: typeof category.count === 'number' ? category.count : 0,
        icon: typeof category.icon === 'string' ? category.icon : 'Pill',
        color: typeof category.color === 'string' ? category.color : 'cyan',
        image: typeof category.image === 'string' ? category.image : null
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-12">
          <div className="text-left">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
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
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-12">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('home.categories.title', language)}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('home.categories.description', language)}
            </p>
          </div>
          <Link 
            to="/shop" 
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            {t('home.categories.viewAll', language)}
          </Link>
        </div>
        
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">
            {t('home.categories.error', language)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Failed to load categories. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
        <div className="text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('home.categories.title', language)}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {t('home.categories.description', language)}
          </p>
        </div>
        <Link 
          to="/shop" 
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl whitespace-nowrap"
        >
          {t('home.categories.viewAll', language)}
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('home.categories.noCategories', language)}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category) => {
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
                        {category.count || 0} {t('home.categories.medicines', language)}
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
  );
};

export default CategoriesGrid;