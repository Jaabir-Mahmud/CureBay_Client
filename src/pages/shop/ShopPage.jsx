import React, { useState } from 'react';
import { Search, Filter, Eye, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for medicines
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
    // Add more medicines...
  ];

  const categories = ['all', 'Tablets', 'Syrups', 'Capsules', 'Injections', 'Supplements', 'Others'];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Shop</h1>
          <p className="text-gray-600">Find the right medication for your health needs</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medicines, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </p>
        </div>

        {/* Medicines Table/Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.map((medicine) => (
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
                      <Badge variant="outline">{medicine.category}</Badge>
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

        {/* Empty State */}
        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No medicines found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
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

export default ShopPage;

