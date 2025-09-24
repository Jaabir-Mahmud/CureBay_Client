import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Eye, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Heart, Shield, Loader2, X, Tag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useCart } from '../../contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import SEOHelmet from '../../components/SEOHelmet';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';

const ShopPage = () => {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);

  // Check if discounts filter is active from URL
  useEffect(() => {
    const discountsParam = searchParams.get('discounts');
    setShowDiscountsOnly(discountsParam === 'true');
  }, [searchParams]);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, sortOrder, itemsPerPage, showDiscountsOnly]);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch medicines with filters
  const { data: medicinesData, isLoading, error, refetch } = useQuery({
    queryKey: ['medicines', {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sortBy,
      sortOrder,
      inStock: true, // Only show in-stock items in shop
      discount: showDiscountsOnly ? true : undefined // Add discount filter
    }],
    queryFn: async ({ queryKey }) => {
      const [, filters] = queryKey;
      
      // If showing discounts only, use the discounted endpoint
      if (showDiscountsOnly) {
        const params = new URLSearchParams();
        params.append('limit', 100); // Get more discounted items
        
        const response = await fetch(`/api/medicines/discounted?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch discounted medicines');
        
        const data = await response.json();
        
        // Apply client-side filtering for search and category
        let filteredMedicines = data.medicines || [];
        
        if (debouncedSearchTerm) {
          filteredMedicines = filteredMedicines.filter(medicine => 
            medicine.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            medicine.genericName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            medicine.company?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
        }
        
        if (selectedCategory !== 'all') {
          filteredMedicines = filteredMedicines.filter(medicine => 
            medicine.category?._id === selectedCategory || medicine.category === selectedCategory
          );
        }
        
        // Apply sorting
        if (sortBy && sortOrder) {
          filteredMedicines.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            // Handle nested category name
            if (sortBy === 'category' && typeof aValue === 'object') {
              aValue = aValue.name;
              bValue = bValue.name;
            }
            
            if (sortOrder === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }
        
        // Apply pagination
        const totalMedicines = filteredMedicines.length;
        const totalPages = Math.ceil(totalMedicines / itemsPerPage);
        const skip = (currentPage - 1) * itemsPerPage;
        const paginatedMedicines = filteredMedicines.slice(skip, skip + itemsPerPage);
        
        return {
          medicines: paginatedMedicines,
          pagination: {
            currentPage,
            totalPages,
            totalMedicines,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1
          }
        };
      } else {
        // Regular medicines endpoint with server-side filtering
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, value.toString());
          }
        });

        const response = await fetch(`/api/medicines?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch medicines');
        return response.json();
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // Keep previous data while loading new data
  });

  const medicines = medicinesData?.medicines || [];
  const pagination = medicinesData?.pagination || {};
  const categories = categoriesData || [];

  const handleAddToCart = (medicine, quantity = 1, selectedVariant) => {
    try {
      // Convert medicine data to cart format
      const cartProduct = {
        id: medicine.id || medicine._id,
        name: medicine.name,
        company: medicine.company,
        price: medicine.finalPrice || medicine.price,
        originalPrice: medicine.price,
        discount: medicine.discountPercentage || 0,
        image: medicine.image,
        category: medicine.category?.name || medicine.category,
        genericName: medicine.genericName,
        massUnit: medicine.massUnit,
        inStock: medicine.inStock,
      };
      
      addToCart(cartProduct, quantity, selectedVariant || medicine.massUnit);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
      console.error('Error adding to cart:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Medicines</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Failed to load medicines. Please try again later.</p>
          <Button onClick={() => refetch()} className="bg-cyan-500 hover:bg-cyan-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title={t('shop.seo.title', language)}
        description={t('shop.seo.description', language)}
        keywords={t('shop.seo.keywords', language)}
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('shop.title', language)}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('shop.description', language)}</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('shop.searchPlaceholder', language)}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={showDiscountsOnly ? "default" : "outline"}
                  onClick={() => setShowDiscountsOnly(!showDiscountsOnly)}
                  className="flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Discounts
                </Button>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('shop.allCategories', language)}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleSortChange('name')}
                className="flex items-center gap-2"
              >
                {t('shop.sortByName', language)}
                {renderSortIndicator('name')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSortChange('price')}
                className="flex items-center gap-2"
              >
                {t('shop.sortByPrice', language)}
                {renderSortIndicator('price')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSortChange('createdAt')}
                className="flex items-center gap-2"
              >
                {t('shop.sortByNewest', language)}
                {renderSortIndicator('createdAt')}
              </Button>
            </div>
          </div>

          {/* Medicine Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('shop.noMedicinesFound', language)}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('shop.tryAdjustingSearch', language)}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {medicines.map((medicine) => (
                  <Card key={`${medicine._id}-${medicine.massUnit}`} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {medicine.discountPercentage > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            {medicine.discountPercentage}% OFF
                          </Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{medicine.name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid md:grid-cols-2 gap-6">
                              <img
                                src={medicine.image}
                                alt={medicine.name}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-lg">{medicine.name}</h3>
                                  <p className="text-gray-600">{t('shop.by', language)} {medicine.company}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">4.5 (128 {t('shop.reviews', language)})</span>
                                </div>
                                <div className="space-y-2">
                                  <p><span className="font-medium">{t('shop.genericName', language)}:</span> {medicine.genericName}</p>
                                  <p><span className="font-medium">{t('shop.category', language)}:</span> {medicine.category?.name || medicine.category}</p>
                                  <p><span className="font-medium">{t('shop.mass', language)}:</span> {medicine.mass} {medicine.massUnit}</p>
                                  <p><span className="font-medium">{t('shop.description', language)}:</span> {medicine.description}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('shop.by', language)} {medicine.company}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          {medicine.discountPercentage > 0 ? (
                            <>
                              <span className="text-lg font-bold text-cyan-600">${medicine.finalPrice}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">${medicine.price}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-cyan-600">${medicine.price}</span>
                          )}
                        </div>
                        <Badge variant="secondary">{medicine.mass} {medicine.massUnit}</Badge>
                      </div>
                      
                      <Button
                        onClick={() => handleAddToCart(medicine, 1, medicine.massUnit)}
                        className="w-full bg-cyan-500 hover:bg-cyan-600"
                        disabled={!medicine.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {medicine.inStock ? t('shop.addToCart', language) : t('shop.outOfStock', language)}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('shop.page', language)} {pagination.currentPage} {t('shop.of', language)} {pagination.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={!pagination.hasNext}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
