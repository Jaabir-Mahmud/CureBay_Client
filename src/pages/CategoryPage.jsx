import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, ArrowLeft, Package, Calendar, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useCart } from '../contexts/CartContext';
import SEOHelmet from '../components/SEOHelmet';
import { createApiUrl } from '../lib/utils';

const CategoryPage = () => {
  const { addToCart, isInCart, wishlist = [] } = useCart();
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, company
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('grid');

  // Fetch the current category by name
  const { data: currentCategory, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: async () => {
      if (!categoryName) return null;
      const response = await fetch(createApiUrl(`/api/categories/name/${encodeURIComponent(categoryName)}`));
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Category not found');
        }
        throw new Error('Failed to fetch category');
      }
      return response.json();
    },
    enabled: !!categoryName,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch medicines for the specific category
  const { 
    data: medicinesData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['medicines', currentCategory?._id, currentPage, itemsPerPage, sortBy, sortOrder, searchTerm],
    queryFn: async () => {
      if (!currentCategory?._id) return { medicines: [], pagination: { total: 0, page: 1, pages: 1 } };
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(createApiUrl(`/api/medicines?category=${currentCategory._id}&${params}`));
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return response.json();
    },
    enabled: !!currentCategory?._id,
    staleTime: 5 * 60 * 1000,
  });

  const medicines = medicinesData?.medicines || [];
  const pagination = medicinesData?.pagination || { total: 0, page: 1, pages: 1 };

  // Filter medicines based on search term (additional client-side filtering)
  const filteredMedicines = medicines.filter(medicine => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      medicine.name.toLowerCase().includes(term) ||
      medicine.genericName.toLowerCase().includes(term) ||
      medicine.company.toLowerCase().includes(term)
    );
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setCurrentPage(newPage);
    }
  };

  // Loading state for category
  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading category...</p>
        </div>
      </div>
    );
  }

  // Error state for category
  if (!currentCategory && categoryName) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The category "{categoryName}" could not be found.
          </p>
          <Link to="/shop">
            <Button>Browse All Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Loading state for medicines
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading medicines...</p>
        </div>
      </div>
    );
  }

  // Error state for medicines
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Medicines</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title={`${currentCategory?.name || 'Category'} - CureBay Online Pharmacy`}
        description={currentCategory?.description || `Browse medicines in the ${currentCategory?.name} category at CureBay.`}
        keywords={`${currentCategory?.name}, medicines, pharmacy, healthcare`}
        url={window.location.href}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Button>
            </Link>
          </div>

          {/* Category Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentCategory?.name || 'All Medicines'}</h1>
                <p className="text-cyan-100 dark:text-gray-300 text-lg">
                  {currentCategory?.description || 'Browse our complete collection of medicines'}
                </p>
              </div>
              {currentCategory?.image && (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={currentCategory.image} 
                    alt={currentCategory.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search medicines..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
              
              {/* Items Per Page */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Items per page:</span>
                <select
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Sort by:</span>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Name {getSortIcon('name')}
                </Button>
                <Button
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1"
                >
                  Price {getSortIcon('price')}
                </Button>
                <Button
                  variant={sortBy === 'company' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('company')}
                  className="flex items-center gap-1"
                >
                  Company {getSortIcon('company')}
                </Button>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300">
                Showing <span className="font-semibold">{filteredMedicines.length}</span> of <span className="font-semibold">{pagination.total}</span> medicines
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">View:</span>
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
          {filteredMedicines.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No medicines found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}>
                Clear Search
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredMedicines.map(medicine => (
                <div 
                  key={medicine._id} 
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
                  onClick={() => window.location.href = `/medicine/${medicine._id}`}
                >
                  {/* Medicine Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/cccccc/ffffff?text=Medicine';
                      }}
                    />
                    {medicine.discountPercentage > 0 && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                        {medicine.discountPercentage}% OFF
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="sm" 
                        className="bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            addToCart(medicine, 1);
                          } catch (err) {
                            console.error('Error adding to cart:', err);
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 border-white shadow-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/medicine/${medicine._id}`;
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="p-4">
                    {/* Medicine Name */}
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg mb-1">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                      by {medicine.company}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {medicine.discountPercentage > 0 ? (
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ৳{(medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                            ৳{medicine.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ৳{medicine.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          addToCart(medicine, 1);
                        } catch (err) {
                          console.error('Error adding to cart:', err);
                        }
                      }}
                      disabled={isInCart(medicine._id, medicine.massUnit)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isInCart(medicine._id, medicine.massUnit) ? 'Added to Cart' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {filteredMedicines.map(medicine => (
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
                            <span className="text-sm">{isInCart(medicine._id, medicine.massUnit) ? 'Added to Cart' : 'Add to Cart'}</span>
                          </Button>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="px-3 py-1.5 rounded-lg border-2"
                              onClick={() => window.location.href = `/medicine/${medicine._id}`}
                            >
                              <Eye className="w-4 h-4" />
                              <span className="ml-1.5">Quick View</span>
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
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1;
                // Show first, last, current, and nearby pages
                if (page === 1 || page === pagination.pages || Math.abs(page - currentPage) <= 2) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                }
                // Show ellipsis for skipped pages
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-2 py-1 text-gray-500">...</span>;
                }
                return null;
              })}
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;