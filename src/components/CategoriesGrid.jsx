import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Pill, Heart, Circle, Syringe, Stethoscope, Tag } from 'lucide-react';

const CategoriesGrid = () => {
  const { language } = useLanguage();

  // Fetch all categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      text: 'text-cyan-600 dark:text-cyan-400'
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-700',
      icon: 'bg-pink-100 dark:bg-pink-900/40',
      text: 'text-pink-600 dark:text-pink-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      icon: 'bg-green-100 dark:bg-green-900/40',
      text: 'text-green-600 dark:text-green-400'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      icon: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-600 dark:text-red-400'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      icon: 'bg-orange-100 dark:bg-orange-900/40',
      text: 'text-orange-600 dark:text-orange-400'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'bg-gray-100 dark:bg-gray-900/40',
      text: 'text-gray-600 dark:text-gray-400'
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">
          {t('home.categories.error', language)}
        </p>
      </div>
    );
  }

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
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded"
        >
          {t('home.categories.viewAll', language)}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.slice(0, 6).map((category) => {
          const IconComponent = iconMap[category.icon] || Pill;
          const colorClasses = colorMap[category.color] || colorMap.cyan;
          return (
            <Link 
              key={category._id} 
              to={`/category/${encodeURIComponent(category.name)}`}
              className="block"
            >
              <Card className={`${colorClasses.bg} ${colorClasses.border} border transition-all duration-300 hover:shadow-lg`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${colorClasses.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded-full">
                      {category.medicineCount} {t('home.categories.medicines', language)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-4 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesGrid;