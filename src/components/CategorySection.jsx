import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Droplets, Circle, Syringe, Package, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: 'Tablets',
      icon: Pill,
      count: 245,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Oral solid dosage forms',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop&auto=format'
    },
    {
      id: 2,
      name: 'Syrups',
      icon: Droplets,
      count: 128,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Liquid medications',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&auto=format'
    },
    {
      id: 3,
      name: 'Capsules',
      icon: Circle,
      count: 189,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      description: 'Encapsulated medicines',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop&auto=format'
    },
    {
      id: 4,
      name: 'Injections',
      icon: Syringe,
      count: 76,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      description: 'Injectable medications',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop&auto=format'
    },
    {
      id: 5,
      name: 'Supplements',
      icon: Heart,
      count: 156,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Health supplements',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&auto=format'
    },
    {
      id: 6,
      name: 'Others',
      icon: Package,
      count: 92,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      description: 'Miscellaneous items',
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop&auto=format'
    }
  ];

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
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Link 
                key={category.id} 
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
                      <div className={`absolute top-4 left-4 w-12 h-12 ${category.bgColor} dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors`}>
                        <IconComponent className={`w-6 h-6 ${category.color.replace('bg-', 'text-')} dark:text-gray-300`} />
                      </div>

                      {/* Count Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300">
                          {category.count} items
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 transition-colors">
                        {category.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                          {category.count} medicines available
                        </span>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
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
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
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

