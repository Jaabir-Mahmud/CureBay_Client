import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Grid, List, Eye, Edit, Trash2, Package, ShoppingCart, Plus, X, Upload, ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import toast from 'react-hot-toast';

const CategoryMedicines = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterInStock, setFilterInStock] = useState('all');

  // Add Medicine Modal State
  const [addMedicineModalOpen, setAddMedicineModalOpen] = useState(false);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    genericName: '',
    description: '',
    image: '',
    category: '',
    company: '',
    massUnit: '',
    price: '',
    unitPrice: '',
    stripPrice: '',
    discountPercentage: '',
    stockQuantity: '',
    isAdvertised: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategoryMedicines();
    fetchAllCategories();
  }, [categoryId]);

  const fetchAllCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategoryMedicines = async () => {
    try {
      setLoading(true);
      
      // Fetch category details
      const categoryRes = await fetch(`/api/categories/${categoryId}`);
      if (categoryRes.ok) {
        const categoryData = await categoryRes.json();
        setCategory(categoryData);
      }
      
      // Fetch medicines in this category
      const medicinesRes = await fetch(`/api/medicines?category=${categoryId}&limit=100`);
      if (medicinesRes.ok) {
        const medicinesData = await medicinesRes.json();
        setMedicines(medicinesData.medicines || []);
      }
    } catch (error) {
      console.error('Error fetching category medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines
    .filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(search.toLowerCase()) ||
                           medicine.genericName.toLowerCase().includes(search.toLowerCase()) ||
                           medicine.company.toLowerCase().includes(search.toLowerCase());
      
      const matchesStock = filterInStock === 'all' || 
                          (filterInStock === 'inStock' && medicine.inStock) ||
                          (filterInStock === 'outOfStock' && !medicine.inStock);
      
      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.finalPrice - b.finalPrice;
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

  const openAddMedicineModal = () => {
    setMedicineForm({
      name: '',
      genericName: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop&auto=format',
      category: categoryId, // Pre-select current category
      company: '',
      massUnit: '',
      price: '',
      unitPrice: '',
      stripPrice: '',
      discountPercentage: '0',
      stockQuantity: '0',
      isAdvertised: false
    });
    setAddMedicineModalOpen(true);
  };

  const closeAddMedicineModal = () => {
    setAddMedicineModalOpen(false);
    setMedicineForm({
      name: '',
      genericName: '',
      description: '',
      image: '',
      category: '',
      company: '',
      massUnit: '',
      price: '',
      unitPrice: '',
      stripPrice: '',
      discountPercentage: '',
      stockQuantity: '',
      isAdvertised: false
    });
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!medicineForm.name.trim()) {
      toast.error('Medicine name is required');
      return;
    }
    if (!medicineForm.genericName.trim()) {
      toast.error('Generic name is required');
      return;
    }
    if (!medicineForm.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!medicineForm.category) {
      toast.error('Category is required');
      return;
    }
    if (!medicineForm.company.trim()) {
      toast.error('Company name is required');
      return;
    }
    if (!medicineForm.massUnit.trim()) {
      toast.error('Mass unit is required');
      return;
    }
    if (!medicineForm.price || isNaN(medicineForm.price) || parseFloat(medicineForm.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        ...medicineForm,
        price: parseFloat(medicineForm.price),
        unitPrice: parseFloat(medicineForm.unitPrice) || 0,
        stripPrice: parseFloat(medicineForm.stripPrice) || 0,
        discountPercentage: parseFloat(medicineForm.discountPercentage) || 0,
        stockQuantity: parseInt(medicineForm.stockQuantity) || 0,
      };

      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newMedicine = await res.json();
        setMedicines(prev => [newMedicine, ...prev]);
        toast.success('Medicine added successfully!');
        closeAddMedicineModal();
        fetchCategoryMedicines(); // Refresh the list
      } else {
        let errorMessage = 'Failed to add medicine';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            
            <Button
              onClick={openAddMedicineModal}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category?.name || 'Category'} Medicines
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {category?.description || 'Manage medicines in this category'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {filteredMedicines.length} medicines found
            </span>
            <span className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              {filteredMedicines.filter(m => m.inStock).length} in stock
            </span>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search medicines by name, generic name, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="name" value="name">Name A-Z</SelectItem>
                    <SelectItem key="price" value="price">Price Low-High</SelectItem>
                    <SelectItem key="stock" value="stock">Stock High-Low</SelectItem>
                    <SelectItem key="company" value="company">Company A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterInStock} onValueChange={setFilterInStock}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="all">All</SelectItem>
                    <SelectItem key="inStock" value="inStock">In Stock</SelectItem>
                    <SelectItem key="outOfStock" value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

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
          </CardContent>
        </Card>

        {/* Medicines Display */}
        {filteredMedicines.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No medicines found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search || filterInStock !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'This category doesn\'t have any medicines yet.'}
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine._id || medicine.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                        {medicine.name}
                      </h3>
                      <Badge variant={medicine.inStock ? 'default' : 'secondary'} className="ml-2">
                        {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {medicine.genericName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {medicine.company} • {medicine.massUnit}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {medicine.discountPercentage > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            ${medicine.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-green-600">
                          ${medicine.finalPrice.toFixed(2)}
                        </span>
                        {medicine.discountPercentage > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">
                            {medicine.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Stock: {medicine.stockQuantity} units
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="text-left p-4 font-medium">Medicine</th>
                      <th className="text-left p-4 font-medium">Company</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium">Stock</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((medicine) => (
                      <tr key={medicine._id || medicine.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={medicine.image}
                              alt={medicine.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {medicine.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {medicine.genericName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {medicine.company}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-green-600">
                              ${medicine.finalPrice.toFixed(2)}
                            </span>
                            {medicine.discountPercentage > 0 && (
                              <span className="text-xs text-gray-500 line-through">
                                ${medicine.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {medicine.stockQuantity} units
                        </td>
                        <td className="p-4">
                          <Badge variant={medicine.inStock ? 'default' : 'secondary'}>
                            {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Medicine Modal */}
      <Dialog open={addMedicineModalOpen} onOpenChange={closeAddMedicineModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Medicine</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new medicine to the category.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddMedicine} className="space-y-4">
            {/* Medicine Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Medicine Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={medicineForm.name}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter medicine name"
                required
                className="mt-1"
              />
            </div>

            {/* Generic Name */}
            <div>
              <Label htmlFor="genericName" className="text-sm font-medium">
                Generic Name
              </Label>
              <Input
                id="genericName"
                type="text"
                value={medicineForm.genericName}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, genericName: e.target.value }))}
                placeholder="Enter generic name"
                className="mt-1"
              />
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Select value={medicineForm.category} onValueChange={(value) => setMedicineForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Brief Description
              </Label>
              <Textarea
                id="description"
                value={medicineForm.description}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter medicine description"
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company" className="text-sm font-medium">
                Company
              </Label>
              <Input
                id="company"
                type="text"
                value={medicineForm.company}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>

            {/* Mass Unit */}
            <div>
              <Label htmlFor="massUnit" className="text-sm font-medium">
                Mass Unit
              </Label>
              <Input
                id="massUnit"
                type="text"
                value={medicineForm.massUnit}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, massUnit: e.target.value }))}
                placeholder="e.g., 500mg, 10ml"
                className="mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-sm font-medium">
                Price (৳) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={medicineForm.price}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter price"
                required
                className="mt-1"
              />
            </div>

            {/* Unit Price */}
            <div>
              <Label htmlFor="unitPrice" className="text-sm font-medium">
                Unit Price (৳)
              </Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={medicineForm.unitPrice}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                placeholder="Enter unit price"
                className="mt-1"
              />
            </div>

            {/* Strip Price */}
            <div>
              <Label htmlFor="stripPrice" className="text-sm font-medium">
                Strip Price (৳)
              </Label>
              <Input
                id="stripPrice"
                type="number"
                step="0.01"
                min="0"
                value={medicineForm.stripPrice}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, stripPrice: e.target.value }))}
                placeholder="Enter strip price"
                className="mt-1"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <Label htmlFor="discountPercentage" className="text-sm font-medium">
                Discount Percentage (%)
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={medicineForm.discountPercentage}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                placeholder="Enter discount percentage"
                className="mt-1"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <Label htmlFor="stockQuantity" className="text-sm font-medium">
                How many want to add *
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={medicineForm.stockQuantity}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                placeholder="Enter quantity"
                required
                className="mt-1"
              />
            </div>

            {/* Medicine Image */}
            <div>
              <Label htmlFor="image" className="text-sm font-medium">
                Medicine Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setMedicineForm(prev => ({ ...prev, imageFile: e.target.files[0] }))}
                className="mt-1"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeAddMedicineModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Medicine
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryMedicines;
