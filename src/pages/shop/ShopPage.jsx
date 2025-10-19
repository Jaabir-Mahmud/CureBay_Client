import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Package, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import MedicineCard from '../../components/shop/MedicineCard';
import MedicineDetailsModal from '../../components/shop/MedicineDetailsModal';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';
import SEOHelmet from '../../components/SEOHelmet';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '../../components/ui/pagination';

const ShopPage = () => {
  const { language } = useLanguage();
  const { addToCart, isInCart, wishlist = [], toggleWishlist } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Show 20 items per page

  // Fetch medicines with pagination
  const { data: medicinesData = { medicines: [], pagination: { total: 0, pages: 1 } }, isLoading, error, refetch } = useQuery({
    queryKey: ['medicines', selectedCategory, currentPage, sortBy, sortOrder, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/medicines?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return response.json();
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const { medicines = [], pagination = { total: 0, pages: 1 } } = medicinesData;

  // Filter and sort medicines (this is now handled by the backend)
  const filteredAndSortedMedicines = useMemo(() => {
    return medicines;
  }, [medicines]);

  const handleQuickView = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.pages;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis and nearby pages
      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis1" />);
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis before last page
      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis2" />);
      }
      
      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={totalPages === currentPage}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('shop.loading', language)}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-4">{t('shop.error', language)}</p>
          <p className="text-gray-600 dark:text-gray-300">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title="Shop Medicines - CureBay Online Pharmacy"
        description="Browse and shop for medicines, healthcare products, and supplements at CureBay. Fast delivery and genuine products."
        keywords="shop medicines, online pharmacy, healthcare products, buy medicines online"
        url={window.location.href}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('shop.allMedicines', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('shop.discover', language)}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('shop.searchPlaceholder', language)}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when search changes
                  }}
                />
              </div>
              
              {/* Category Filter */}
              <div>
                <select
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1); // Reset to first page when category changes
                  }}
                >
                  <option value="">{t('shop.allCategories', language)}</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort */}
              <div>
                <select
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                    setCurrentPage(1); // Reset to first page when sort changes
                  }}
                >
                  <option value="name-asc">{t('shop.sortByNameAsc', language)}</option>
                  <option value="name-desc">{t('shop.sortByNameDesc', language)}</option>
                  <option value="price-asc">{t('shop.sortByPriceAsc', language)}</option>
                  <option value="price-desc">{t('shop.sortByPriceDesc', language)}</option>
                  <option value="company-asc">{t('shop.sortByCompanyAsc', language)}</option>
                  <option value="company-desc">{t('shop.sortByCompanyDesc', language)}</option>
                </select>
              </div>
            </div>
            
            {/* View Mode and Results Count */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-600 dark:text-gray-300">
                {t('shop.showing', language)} <span className="font-semibold">{filteredAndSortedMedicines.length}</span> {t('shop.results', language)} {t('shop.of', language)} <span className="font-semibold">{pagination.total}</span> {t('shop.results', language)}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">{t('shop.view', language)}:</span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Medicine Grid/List */}
          {filteredAndSortedMedicines.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('shop.noMedicinesFound', language)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('shop.tryDifferentSearch', language)}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedMedicines.map(medicine => (
                <MedicineCard
                  key={medicine._id}
                  medicine={{
                    ...medicine,
                    // Ensure proper data types
                    name: typeof medicine.name === 'string' ? medicine.name : 'Unknown Medicine',
                    company: typeof medicine.company === 'string' ? medicine.company : 'Unknown Company',
                    description: typeof medicine.description === 'string' ? medicine.description : '',
                    image: typeof medicine.image === 'string' ? medicine.image : 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine',
                    price: typeof medicine.price === 'number' ? medicine.price : 0,
                    discountPercentage: typeof medicine.discountPercentage === 'number' ? medicine.discountPercentage : 0,
                    finalPrice: typeof medicine.finalPrice === 'number' ? medicine.finalPrice : 
                      (typeof medicine.price === 'number' && typeof medicine.discountPercentage === 'number' ? 
                        medicine.price * (1 - medicine.discountPercentage / 100) : 0)
                  }}
                  onQuickView={handleQuickView}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.some(item => item._id === medicine._id)}
                  showOnlyEyeIcon={true} // Pass this prop to show only eye icon
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedMedicines.map(medicine => (
                <div key={medicine._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-all duration-200 hover:shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Medicine Image */}
                    <div className="relative w-full sm:w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={medicine.image}
                        alt={medicine.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                        }}
                      />
                      {medicine.discountPercentage > 0 && (
                        <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          -{medicine.discountPercentage}%
                        </Badge>
                      )}
                      {!medicine.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Medicine Details */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        {/* Left side - Medicine info */}
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                              {typeof medicine.category === 'object' && medicine.category !== null 
                                ? medicine.category.name 
                                : medicine.category || 'Uncategorized'}
                            </Badge>
                            {medicine.prescriptionRequired && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full border-amber-500 text-amber-500">
                                <Shield className="w-3 h-3 mr-1" />
                                Rx
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {medicine.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            {medicine.genericName}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            by {medicine.company}
                          </p>
                          
                          {/* Price Section */}
                          <div className="mt-3 flex flex-wrap items-baseline gap-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              ৳{(medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100)).toFixed(2)}
                            </span>
                            {medicine.discountPercentage > 0 && (
                              <>
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ৳{medicine.price.toFixed(2)}
                                </span>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-1.5 py-0.5 rounded">
                                  Save ৳{(medicine.price - (medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100))).toFixed(2)}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Right side - Actions */}
                        <div className="flex flex-col sm:items-end gap-2">
                          <Button 
                            className={`px-4 py-2 text-sm font-medium ${
                              isInCart(medicine._id, medicine.massUnit) 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-cyan-500 hover:bg-cyan-600'
                            } text-white rounded-lg shadow`}
                            onClick={() => {
                              try {
                                addToCart(medicine, 1);
                              } catch (err) {
                                console.error('Error adding to cart:', err);
                              }
                            }}
                            disabled={!medicine.inStock}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1.5" />
                            {isInCart(medicine._id, medicine.massUnit) ? t('shop.addedToCart', language) : t('shop.addToCart', language)}
                          </Button>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="px-3 py-1.5 rounded-lg border-2"
                              onClick={() => handleQuickView(medicine)}
                            >
                              <Eye className="w-4 h-4" />
                              <span className="ml-1.5">{t('shop.quickView', language)}</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`px-3 py-1.5 rounded-lg border-2 ${
                                wishlist.some(item => item._id === medicine._id) 
                                  ? "text-red-500 border-red-500" 
                                  : ""
                              }`}
                              onClick={() => toggleWishlist(medicine)}
                            >
                              <Heart className={`w-4 h-4 ${wishlist.some(item => item._id === medicine._id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === pagination.pages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Medicine Details Modal */}
      {isModalOpen && selectedMedicine && (
        <MedicineDetailsModal
          medicine={selectedMedicine}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          isWishlisted={wishlist.some(item => item._id === selectedMedicine._id)}
          onToggleWishlist={toggleWishlist}
        />
      )}
    </>
  );
};

export default ShopPage;