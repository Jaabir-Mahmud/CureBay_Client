import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Droplets, Circle, Syringe, Package, Heart, Stethoscope, Tag, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const CategorySection = () => {
  // Icon mapping for categories
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Pill': Pill,
      'Heart': Heart,
      'Circle': Circle,
      'Syringe': Syringe,
      'Package': Package,
      'Stethoscope': Stethoscope,
      'Tag': Tag
    };
    return iconMap[iconName] || Pill;
  };

  // Color mapping for categories
  const getColorClasses = (colorName) => {
    const colorMap = {
      'blue': {
        bg: 'bg-cyan-500',
        bgLight: 'bg-cyan-50',
        text: 'text-cyan-600'
      },
      'pink': {
        bg: 'bg-pink-500',
        bgLight: 'bg-pink-50',
        text: 'text-pink-600'
      },
      'green': {
        bg: 'bg-green-500',
        bgLight: 'bg-green-50',
        text: 'text-green-600'
      },
      'red': {
        bg: 'bg-red-500',
        bgLight: 'bg-red-50',
        text: 'text-red-600'
      },
      'orange': {
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-50',
        text: 'text-orange-600'
      },
      'gray': {
        bg: 'bg-gray-500',
        bgLight: 'bg-gray-50',
        text: 'text-gray-600'
      }
    };
    return colorMap[colorName] || colorMap['blue'];
  };

  // Fetch categories using TanStack Query
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    onError: (error) => {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    }
  });

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Find the right medication for your needs from our comprehensive categories
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading categories...</span>
          </div>
        </div>
      </section>
    );
  }

  // Show error state with fallback
  if (error) {
    console.warn('Categories API error, showing fallback categories:', error);
  }

  // Use real categories from API, with fallback if empty
  const displayCategories = categories.length > 0 ? categories : [];

  // If no categories available, show message
  if (displayCategories.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Find the right medication for your needs from our comprehensive categories
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No categories available at the moment.</p>
            <Link to="/shop">
              <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors">
                Browse All Medicines
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            Find the right medication for your needs from our comprehensive categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            const colorClasses = getColorClasses(category.color);
            
            return (
              <Link 
                key={category.id || category._id} 
                to={`/category/${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      
                      {/* Icon Overlay */}
                      <div className={`absolute top-4 left-4 w-12 h-12 ${colorClasses.bgLight} dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.text} dark:text-gray-300`} />
                      </div>

                      {/* Count Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300">
                          {category.count || 0} items
                        </Badge>
                      </div>

                      {/* Status Badge */}
                      {category.status === 'inactive' && (
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                            Inactive
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 transition-colors">
                        {category.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                          {category.count || 0} medicines available
                        </span>
                        <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-medium group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                          View All
                          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link to="/shop">
            <button className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
              View All Categories
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

