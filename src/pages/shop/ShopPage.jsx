import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Heart, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useCart } from '../../contexts/CartContext';
import SEOHelmet from '../../components/SEOHelmet';
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
  const [sortBy, setSortBy] = useState('name'); // name, price, rating, company
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data for medicines - expanded for pagination testing
  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      company: 'PharmaCorp',
      category: 'Tablets',
      price: 19.99,
      originalPrice: 25.99,
      discount: 23,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Effective pain relief and fever reducer for adults and children over 12 years.',
      genericName: 'Acetaminophen',
      massUnit: '500mg',
      usage: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.'
    },
    {
      id: 2,
      name: 'Cough Syrup 100ml',
      company: 'MediCare',
      category: 'Syrups',
      price: 12.99,
      originalPrice: 18.50,
      discount: 30,
      rating: 4.2,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Natural cough relief formula with honey and herbal extracts.',
      genericName: 'Dextromethorphan',
      massUnit: '100ml',
      usage: 'Adults: 10ml every 4 hours. Children 6-12: 5ml every 4 hours.'
    },
    {
      id: 3,
      name: 'Vitamin D3 Capsules',
      company: 'HealthPlus',
      category: 'Supplements',
      price: 24.99,
      originalPrice: 32.00,
      discount: 22,
      rating: 4.7,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Essential vitamin for bone health and immune system support.',
      genericName: 'Cholecalciferol',
      massUnit: '1000 IU',
      usage: 'Take 1 capsule daily with food or as directed by healthcare provider.'
    },
    {
      id: 4,
      name: 'Ibuprofen 400mg',
      company: 'PainAway',
      category: 'Tablets',
      price: 16.99,
      originalPrice: 22.00,
      discount: 23,
      rating: 4.3,
      reviews: 175,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Anti-inflammatory pain relief for muscle and joint pain.',
      genericName: 'Ibuprofen',
      massUnit: '400mg',
      usage: 'Take 1 tablet every 6-8 hours with food. Maximum 3 tablets daily.'
    },
    {
      id: 5,
      name: 'Amoxicillin 500mg',
      company: 'AntiBio',
      category: 'Capsules',
      price: 28.99,
      originalPrice: 35.99,
      discount: 19,
      rating: 4.6,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Broad-spectrum antibiotic for bacterial infections.',
      genericName: 'Amoxicillin',
      massUnit: '500mg',
      usage: 'Take 1 capsule every 8 hours for 7-10 days as prescribed.'
    },
    {
      id: 6,
      name: 'Insulin Injection',
      company: 'DiabCare',
      category: 'Injections',
      price: 45.99,
      originalPrice: 52.00,
      discount: 12,
      rating: 4.8,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Fast-acting insulin for diabetes management.',
      genericName: 'Human Insulin',
      massUnit: '100 units/ml',
      usage: 'Inject subcutaneously as directed by healthcare provider.'
    },
    {
      id: 7,
      name: 'Multivitamin Tablets',
      company: 'VitaMax',
      category: 'Supplements',
      price: 21.99,
      originalPrice: 29.99,
      discount: 27,
      rating: 4.4,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Complete daily nutrition with essential vitamins and minerals.',
      genericName: 'Multivitamin Complex',
      massUnit: '30 tablets',
      usage: 'Take 1 tablet daily with breakfast.'
    },
    {
      id: 8,
      name: 'Aspirin 325mg',
      company: 'HeartCare',
      category: 'Tablets',
      price: 8.99,
      originalPrice: 12.99,
      discount: 31,
      rating: 4.1,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Low-dose aspirin for cardiovascular health.',
      genericName: 'Acetylsalicylic Acid',
      massUnit: '325mg',
      usage: 'Take 1 tablet daily as directed by healthcare provider.'
    },
    {
      id: 9,
      name: 'Omega-3 Capsules',
      company: 'FishOil Plus',
      category: 'Supplements',
      price: 33.99,
      originalPrice: 42.99,
      discount: 21,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      inStock: false,
      description: 'High-quality fish oil for heart and brain health.',
      genericName: 'Omega-3 Fatty Acids',
      massUnit: '1000mg',
      usage: 'Take 2 capsules daily with meals.'
    },
    {
      id: 10,
      name: 'Antihistamine Syrup',
      company: 'AllergyFree',
      category: 'Syrups',
      price: 14.99,
      originalPrice: 19.99,
      discount: 25,
      rating: 4.2,
      reviews: 112,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Relief from allergic reactions and seasonal allergies.',
      genericName: 'Cetirizine',
      massUnit: '150ml',
      usage: 'Adults: 10ml once daily. Children 6-12: 5ml once daily.'
    },
    {
      id: 11,
      name: 'Probiotic Capsules',
      company: 'GutHealth',
      category: 'Supplements',
      price: 26.99,
      originalPrice: 34.99,
      discount: 23,
      rating: 4.5,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Support digestive health with beneficial bacteria.',
      genericName: 'Lactobacillus Complex',
      massUnit: '30 capsules',
      usage: 'Take 1 capsule daily with food.'
    },
    {
      id: 12,
      name: 'Iron Tablets',
      company: 'BloodBoost',
      category: 'Supplements',
      price: 18.99,
      originalPrice: 24.99,
      discount: 24,
      rating: 4.0,
      reviews: 87,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      inStock: true,
      description: 'Essential iron supplement for anemia prevention.',
      genericName: 'Ferrous Sulfate',
      massUnit: '65mg',
      usage: 'Take 1 tablet daily on empty stomach or as directed.'
    }
  ];

  const categories = ['all', 'Tablets', 'Syrups', 'Capsules', 'Injections', 'Supplements', 'Others'];

  // Memoized filtering, sorting, and pagination
  const { paginatedMedicines, totalPages, totalItems } = useMemo(() => {
    // Filter medicines
    let filtered = medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort medicines
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMedicines = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { paginatedMedicines, totalPages, totalItems };
  }, [medicines, searchTerm, selectedCategory, sortBy, sortOrder, currentPage, itemsPerPage]);

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
    setSelectedCategory('all');
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
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {(medicine.tags || []).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
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
                <Badge variant="outline" className="text-xs">{medicine.category}</Badge>
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
                <span className="text-3xl font-bold text-blue-600">${medicine.price}</span>
                {medicine.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${medicine.originalPrice}</span>
                )}
                {medicine.discount && (
                  <Badge className="bg-red-500 text-white">Save ${(medicine.originalPrice - medicine.price).toFixed(2)}</Badge>
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
                  Total: ${(medicine.price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAddToCart({...medicine, quantity, selectedVariant})}
                  disabled={!medicine.inStock}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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
              
              {/* Additional Info */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <Shield className="w-4 h-4" />
                  <span>Authentic medicine with quality guarantee</span>
                </div>
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
        title="Shop Medicines - CureBay Online Pharmacy"
        description="Browse our extensive collection of medicines, supplements, and healthcare products. Find quality medications from trusted brands with fast delivery."
        keywords="online pharmacy medicines, buy medicines online, prescription drugs, healthcare products, supplements, medical supplies"
        url={window.location.href}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              onClick={resetFilters}
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
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
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
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
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
            Showing {paginatedMedicines.length} of {totalItems} results
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Medicine Grid */}
        {paginatedMedicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 transition-colors">No medicines found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedMedicines.map((medicine) => (
              <Card key={medicine.id} className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  {/* Medicine Image */}
                  <div className="relative">
                    <img
                      className="h-48 w-full object-cover rounded-lg"
                      src={medicine.image}
                      alt={medicine.name}
                    />
                  </div>

                  {/* Medicine Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors">by {medicine.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 transition-colors">{medicine.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{medicine.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({medicine.reviews})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-blue-600">
                        ${medicine.price}
                      </span>
                      {medicine.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${medicine.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <MedicineModal medicine={medicine} />
                      </Dialog>
                      
                      <Button
                        onClick={() => handleAddToCart(medicine)}
                        disabled={!medicine.inStock}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
        {totalItems === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No medicines found matching your criteria.</p>
            <Button
              onClick={resetFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ShopPage;

