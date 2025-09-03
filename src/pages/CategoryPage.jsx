import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Eye, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, rating, company
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data for medicines - would be filtered by category from API
  const allMedicines = [
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
    }
  ];

  // Filter medicines by category name
  const categoryMedicines = allMedicines.filter(medicine => 
    medicine.category.toLowerCase() === categoryName?.toLowerCase()
  );

  // Memoized filtering, sorting, and pagination
  const { paginatedMedicines, totalPages, totalItems } = useMemo(() => {
    // Filter medicines by search term
    let filtered = categoryMedicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
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
  }, [categoryMedicines, searchTerm, sortBy, sortOrder, currentPage, itemsPerPage]);

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

  const handleAddToCart = (medicine) => {
    // Add to cart logic
    console.log('Adding to cart:', medicine);
  };

  const MedicineModal = ({ medicine }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{medicine.name}</DialogTitle>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <div>
            <Badge variant="outline">{medicine.category}</Badge>
            <h3 className="text-xl font-semibold mt-2">{medicine.name}</h3>
            <p className="text-gray-600">by {medicine.company}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{medicine.rating}</span>
            </div>
            <span className="text-gray-500">({medicine.reviews} reviews)</span>
          </div>

          <div className="space-y-2">
            <p><strong>Generic Name:</strong> {medicine.genericName}</p>
            <p><strong>Strength:</strong> {medicine.massUnit}</p>
            <p><strong>Description:</strong> {medicine.description}</p>
            <p><strong>Usage:</strong> {medicine.usage}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">${medicine.price}</span>
            {medicine.originalPrice && (
              <span className="text-lg text-gray-500 line-through">${medicine.originalPrice}</span>
            )}
            {medicine.discount && (
              <Badge className="bg-red-500">-{medicine.discount}%</Badge>
            )}
          </div>

          <Button
            onClick={() => handleAddToCart(medicine)}
            disabled={!medicine.inStock}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
            {categoryName} Medicines
          </h1>
          <p className="text-gray-600">
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
              <span className="text-sm text-gray-600">Sort by:</span>
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
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
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

        {/* Results Count and Pagination Info */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} medicines
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Medicine
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('company')}
                  >
                    <div className="flex items-center gap-1">
                      Company
                      {getSortIcon('company')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center gap-1">
                      Rating
                      {getSortIcon('rating')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMedicines.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={medicine.image}
                          alt={medicine.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {medicine.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {medicine.genericName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{medicine.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({medicine.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        {totalItems === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {categoryName?.toLowerCase()} medicines found matching your criteria.
            </p>
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
  );
};

export default CategoryPage;