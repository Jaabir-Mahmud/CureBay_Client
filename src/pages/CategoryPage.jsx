import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Eye, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useCart } from '../contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SEOHelmet from '../components/SEOHelmet';
import MedicineCard from '../components/shop/MedicineCard.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

const CategoryPage = () => {
  const { addToCart } = useCart();
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, rating, company
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch the current category by name
  const { data: currentCategory, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: async () => {
      if (!categoryName) return null;
      const response = await fetch(`/api/categories/name/${encodeURIComponent(categoryName)}`);
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
    queryKey: ['medicines', {
      category: currentCategory?.id,
      search: searchTerm,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: itemsPerPage
    }],
    queryFn: async () => {
      if (!currentCategory?._id) return { medicines: [], pagination: { totalMedicines: 0, totalPages: 0 } };
      
      const params = new URLSearchParams({
        category: currentCategory._id,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder
      });
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      const response = await fetch(`/api/medicines?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      return response.json();
    },
    enabled: !!currentCategory?._id, // Only run when we have a category ID
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to load medicines. Please try again.');
    }
  });

  const medicines = medicinesData?.medicines || [];
  const totalItems = medicinesData?.pagination?.totalMedicines || 0;
  const totalPages = medicinesData?.pagination?.totalPages || 0;

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleAddToCart = (productData) => {
    const { quantity = 1, selectedVariant, ...product } = productData;
    addToCart(product, quantity, selectedVariant);
  };

  // Show loading state
  if (categoryLoading || isLoading) {
    return (
      <>
        <SEOHelmet
          title={`${categoryName} Medicines - CureBay Online Pharmacy`}
          description={`Browse ${categoryName?.toLowerCase()} medicines and healthcare products. Find quality ${categoryName?.toLowerCase()} from trusted brands with fast delivery.`}
          keywords={`${categoryName?.toLowerCase()} medicines, buy ${categoryName?.toLowerCase()} online, ${categoryName?.toLowerCase()} pharmacy, healthcare products`}
          url={window.location.href}
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  {categoryLoading ? 'Loading category...' : 'Loading medicines...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error state or category not found
  if (error || !currentCategory) {
    const isNotFound = !currentCategory && !categoryLoading;
    return (
      <>
        <SEOHelmet
          title={`${categoryName} Medicines - CureBay Online Pharmacy`}
          description={`Browse ${categoryName?.toLowerCase()} medicines and healthcare products.`}
          keywords={`${categoryName?.toLowerCase()} medicines`}
          url={window.location.href}
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {isNotFound ? 'Category Not Found' : 'Error Loading Category'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {isNotFound 
                  ? `The category "${categoryName}" could not be found.`
                  : 'Failed to load category and medicines.'
                }
              </p>
              <div className="space-x-4">
                <Link to="/shop">
                  <Button>Browse All Medicines</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">Go Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const MedicineModal = ({ medicine }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(medicine.massUnit);
    
    const variants = [
      medicine.massUnit,
      ...(medicine.alternativeUnits || [])
    ];

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {medicine.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
              {medicine.discount && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                    -{medicine.discount}% OFF
                  </Badge>
                </div>
              )}
              {!medicine.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-bold text-lg">Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Category Badge */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200">
                {medicine.category}
              </Badge>
              {(medicine.tags || []).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Header Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{medicine.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">by <strong>{medicine.company}</strong></p>
            </div>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(medicine.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="ml-1 font-medium text-gray-900 dark:text-white">{medicine.rating}</span>
              </div>
              <span className="text-gray-500">({medicine.reviews} reviews)</span>
            </div>

            {/* Product Details */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Generic Name:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{medicine.genericName}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Strength:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedVariant}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{medicine.company}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <p className={`font-medium ${
                    medicine.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{medicine.description}</p>
            </div>

            {/* Usage Instructions */}
            {medicine.usage && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Instructions</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{medicine.usage}</p>
              </div>
            )}

            {/* Price */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-cyan-500">৳{typeof medicine.finalPrice === 'number' ? medicine.finalPrice.toFixed(2) : (typeof medicine.price === 'number' ? medicine.price.toFixed(2) : medicine.price)}</span>
                {medicine.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">৳{typeof medicine.originalPrice === 'number' ? medicine.originalPrice.toFixed(2) : medicine.originalPrice}</span>
                )}
                {medicine.discountPercentage && (
                  <Badge className="bg-red-500 text-white">Save ৳{((medicine.originalPrice || medicine.price) - (medicine.finalPrice || medicine.price)).toFixed(2)}</Badge>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1"
                  >
                    -
                  </Button>
                  <span className="px-4 py-1 min-w-[50px] text-center border-x">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  Total: ৳{((medicine.finalPrice || medicine.price) * quantity).toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAddToCart({...medicine, quantity, selectedVariant})}
                  disabled={!medicine.inStock}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {medicine.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  className="px-4"
                  onClick={() => {
                    // Add to wishlist logic
                    console.log('Added to wishlist:', medicine.id);
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <>
      <SEOHelmet
        title={`${categoryName} Medicines - CureBay Online Pharmacy`}
        description={`Browse ${categoryName?.toLowerCase()} medicines and healthcare products. Find quality ${categoryName?.toLowerCase()} from trusted brands with fast delivery.`}
        keywords={`${categoryName?.toLowerCase()} medicines, buy ${categoryName?.toLowerCase()} online, ${categoryName?.toLowerCase()} pharmacy, healthcare products`}
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/shop">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 capitalize transition-colors">
            {categoryName} Medicines
          </h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors">
            Discover quality {categoryName?.toLowerCase()} for your health needs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines, companies, generic names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              onClick={resetFilters}
              variant="outline"
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          </div>
          
          {/* Sort and Items per Page Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
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
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('rating')}
                  className="flex items-center gap-1"
                >
                  Rating {getSortIcon('rating')}
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
            
            {/* Items Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 transition-colors">
            Showing {medicines.length} of {totalItems} results
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading medicines...</span>
            </div>
          )}
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {/* Show page numbers */}
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                  
                  // Adjust start page if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                  
                  // Add first page and ellipsis if needed
                  if (startPage > 1) {
                    pages.push(
                      <Button
                        key={1}
                        variant={1 === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="w-8 h-8 p-0"
                      >
                        1
                      </Button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-500">...</span>
                      );
                    }
                  }
                  
                  // Add visible page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className="w-8 h-8 p-0"
                      >
                        {i}
                      </Button>
                    );
                  }
                  
                  // Add ellipsis and last page if needed
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-500">...</span>
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        variant={totalPages === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    );
                  }
                  
                  return pages;
                })()}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalItems === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {categoryName?.toLowerCase()} medicines found{searchTerm ? ` matching "${searchTerm}"` : ''}.
            </p>
            <Button
              onClick={resetFilters}
              className="mt-4"
            >
              {searchTerm ? 'Clear Search' : 'Back to All Categories'}
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CategoryPage;