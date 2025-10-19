import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Pill, Heart, Stethoscope, Circle, Syringe, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

const CategorySection = () => {
  const { language } = useLanguage();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch categories with medicine counts
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categoriesWithCounts'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      
      // Transform data to match expected format
      return data.map(category => ({
        ...category,
        id: category._id,
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
  });

  // Map icon names to actual components
  const iconMap = {
    Pill: Pill,
    Heart: Heart,
    Stethoscope: Stethoscope,
    Circle: Circle,
    Syringe: Syringe,
    Tag: Tag
  };

  // Map color names to Tailwind classes
  const colorMap = {
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.category.title', language)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('home.category.subtitle', language)}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.category.title', language)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('home.category.error', language)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.category.title', language)}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('home.category.subtitle', language)}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((category) => {
            const IconComponent = iconMap[category.icon] || Pill;
            const colorClass = colorMap[category.color] || colorMap.cyan;
            
            return (
              <div 
                key={category.id} 
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = `/category/${encodeURIComponent(category.name)}`}
              >
                <div className={`bg-gradient-to-br ${colorClass} p-6 text-white`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count} {t('home.category.items', language)}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Featured Medicines Preview */}
        {categories.length > 0 && categories[0].medicines && categories[0].medicines.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('home.category.featured', language)} {categories[0].name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories[0].medicines.slice(0, 5).map((medicine) => (
                <div 
                  key={medicine._id} 
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => openMedicineDetails(medicine)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                      <Button 
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-xl transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {t('home.category.quickView', language)}
                      </Button>
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-b-xl p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg mb-1">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {medicine.company}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ৳{(medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100)).toFixed(2)}
                        </span>
                        {medicine.discountPercentage > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through ml-1">
                            ৳{medicine.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medicine Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              {selectedMedicine?.name}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsDialogOpen(false);
                  if (selectedMedicine) {
                    window.location.href = `/medicine/${selectedMedicine._id}`;
                  }
                }}
                className="ml-auto"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t('home.category.viewDetails', language)}
              </Button>
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
                
                {/* Price */}
                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        ৳{(selectedMedicine.finalPrice || selectedMedicine.price * (1 - (selectedMedicine.discountPercentage || 0) / 100)).toFixed(2)}
                      </span>
                      {selectedMedicine.discountPercentage > 0 && (
                        <>
                          <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                            ৳{selectedMedicine.price.toFixed(2)}
                          </span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Save ৳{(selectedMedicine.price - (selectedMedicine.finalPrice || selectedMedicine.price * (1 - (selectedMedicine.discountPercentage || 0) / 100))).toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button 
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                    onClick={() => {
                      window.location.href = `/medicine/${selectedMedicine._id}`;
                      setIsDialogOpen(false);
                    }}
                  >
                    {t('home.category.viewDetails', language)}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t('home.category.close', language)}
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

export default CategorySection;