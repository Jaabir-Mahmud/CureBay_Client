import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Eye, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Heart, Shield, Loader2 } from 'lucide-react';
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

const ShopPage = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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
  }, [selectedCategory, sortBy, sortOrder, itemsPerPage]);

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
      inStock: true // Only show in-stock items in shop
    }],
    queryFn: async ({ queryKey }) => {
      const [, filters] = queryKey;
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/medicines?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return response.json();
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
      toast.success(`${medicine.name} added to cart successfully!`);
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const renderPagination = () => {
    const { currentPage: page, totalPages, hasNext, hasPrev } = pagination;
    
    if (!totalPages || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev || isLoading}
          className="px-3 py-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              className="px-3 py-2"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            onClick={() => handlePageChange(pageNum)}
            disabled={isLoading}
            className="px-3 py-2"
          >
            {pageNum}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext || isLoading}
          className="px-3 py-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const MedicineModal = ({ medicine, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(medicine.massUnit);
    const [isOpen, setIsOpen] = useState(false);
    
    const variants = [
      medicine.massUnit,
      ...(medicine.alternativeUnits || [])
    ].filter(Boolean);

    const handleAddToCart = () => {
      try {
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
        
        onAddToCart(cartProduct, quantity, selectedVariant || medicine.massUnit);
        setIsOpen(false);
        toast.success(`${quantity}x ${medicine.name} added to cart!`);
      } catch (error) {
        toast.error('Failed to add item to cart. Please try again.');
        console.error('Error adding to cart:', error);
      }
    };

    const handleWishlist = () => {
      toast.success(`${medicine.name} added to wishlist!`);
      console.log('Added to wishlist:', medicine.id);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
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
                  src={medicine.image || '/placeholder-medicine.jpg'}
                  alt={medicine.name}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-medicine.jpg';
                  }}
                />
                {medicine.discountPercentage && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                      -{medicine.discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
                {!medicine.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(medicine.tags || []).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {medicine.category?.name || medicine.category}
                  </Badge>
                  {medicine.isPrescriptionRequired && (
                    <Badge className="bg-orange-100 text-orange-700 text-xs">Prescription Required</Badge>
                  )}
                </div>
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
                        i < Math.floor(medicine.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {medicine.rating || 0}
                  </span>
                </div>
                <span className="text-gray-500">({medicine.reviews || 0} reviews)</span>
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
              {medicine.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{medicine.description}</p>
                </div>
              )}

              {/* Usage Instructions */}
              {medicine.usage && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Instructions</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{medicine.usage}</p>
                </div>
              )}

              {/* Variant Selection */}
              {variants.length > 1 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Available Strengths</h4>
                  <div className="flex gap-2">
                    {variants.map((variant) => (
                      <Button
                        key={variant}
                        variant={selectedVariant === variant ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedVariant(variant)}
                        className="text-xs"
                      >
                        {variant}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-cyan-500">
                    ${(medicine.finalPrice || medicine.price).toFixed(2)}
                  </span>
                  {medicine.originalPrice && medicine.originalPrice !== medicine.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ${medicine.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {medicine.discountPercentage && (
                    <Badge className="bg-red-500 text-white">
                      Save ${((medicine.originalPrice || medicine.price) - (medicine.finalPrice || medicine.price)).toFixed(2)}
                    </Badge>
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
                    Total: ${((medicine.finalPrice || medicine.price) * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!medicine.inStock}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {medicine.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
                  </Button>
                  <Button
                    variant="outline"
                    className="px-4"
                    onClick={handleWishlist}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Additional Info */}
                <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-cyan-700 dark:text-cyan-300">
                    <Shield className="w-4 h-4" />
                    <span>Authentic medicine with quality guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <SEOHelmet
        title="Shop Medicines - CureBay Online Pharmacy"
        description="Browse our extensive collection of medicines, supplements, and healthcare products. Find quality medications from trusted brands with fast delivery."
        keywords="online pharmacy medicines, buy medicines online, prescription drugs, healthcare products, supplements, medical supplies"
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">All Medicines</h1>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">Find the medicines you need from our extensive collection</p>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-colors">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medicines, companies, generic names..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="whitespace-nowrap"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Categories:</span>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id || category._id} value={category.id || category._id}>
                        {category.name} {category.count && `(${category.count})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Sort and Items per Page Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Sort by:</span>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('name')}
                    className="flex items-center gap-1"
                  >
                    Name {getSortIcon('name')}
                  </Button>
                  <Button
                    variant={sortBy === 'price' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('price')}
                    className="flex items-center gap-1"
                  >
                    Price {getSortIcon('price')}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Items per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medicine Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading && (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-600" />
                  <p className="text-gray-600 dark:text-gray-300">Loading medicines...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-red-500 mb-4">Failed to load medicines. Please try again.</p>
                  <Button onClick={() => refetch()} variant="outline">
                    Retry
                  </Button>
                </div>
              </div>
            )}
            
            {medicines.length === 0 && !isLoading && !error && (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No medicines found matching your criteria.</p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
            
            {medicines.map((medicine) => (
              <Card key={medicine.id || medicine._id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={medicine.image || '/placeholder-medicine.jpg'}
                    alt={medicine.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-medicine.jpg';
                    }}
                  />
                  {medicine.discountPercentage && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-bold">
                        -{medicine.discountPercentage}% OFF
                      </Badge>
                    </div>
                  )}
                  {!medicine.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                      <span className="text-white font-bold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {medicine.category?.name || medicine.category}
                    </Badge>
                    {medicine.isPrescriptionRequired && (
                      <Badge className="bg-orange-100 text-orange-700 text-xs">Rx</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-cyan-600 transition-colors">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      by <strong>{medicine.company}</strong>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${
                          i < Math.floor(medicine.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-1 text-xs font-medium text-gray-900 dark:text-white">
                      {medicine.rating || 0}
                    </span>
                    <span className="text-xs text-gray-500">({medicine.reviews || 0})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-cyan-600">
                      ${(medicine.finalPrice || medicine.price).toFixed(2)}
                    </span>
                    {medicine.originalPrice && medicine.originalPrice !== medicine.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${medicine.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => handleAddToCart(medicine)}
                      disabled={!medicine.inStock}
                      size="sm"
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-xs"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    
                    <MedicineModal 
                      medicine={medicine} 
                      onAddToCart={handleAddToCart}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2"
                      onClick={() => {
                        toast.success(`${medicine.name} added to wishlist!`);
                        console.log('Added to wishlist:', medicine.id);
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default ShopPage;