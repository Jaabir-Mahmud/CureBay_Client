import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Grid, List, Eye, Edit, Trash2, Package, ShoppingCart, Plus, X, Upload, ImageIcon, Check, XCircle } from 'lucide-react';
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
import { useAuth } from '../../../contexts/AuthContext';
import './CategoryMedicines.css'; // Import the CSS file
import { createApiUrl } from '../../../lib/utils';

const CategoryMedicines = () => {
  const { user } = useAuth();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [category, setCategory] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterInStock, setFilterInStock] = useState('all');

  // Get the tab to return to from URL params
  const fromTab = searchParams.get('fromTab') || 'categories';

  // Function to handle back navigation with proper tab restoration
  const handleBackNavigation = () => {
    navigate(`/dashboard/admin?tab=${fromTab}`);
  };

  // Add Medicine Modal State
  const [addMedicineModalOpen, setAddMedicineModalOpen] = useState(false);
  // Edit Medicine Modal State
  const [editMedicineModalOpen, setEditMedicineModalOpen] = useState(false);
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
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Helper function to upload image file
  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(createApiUrl('/api/upload/image'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    return await response.json();
  };

  useEffect(() => {
    // Validate categoryId before fetching data
    if (!categoryId || categoryId === 'undefined') {
      toast.error('Invalid category ID. Please select a valid category.');
      setLoading(false);
      return;
    }
    
    fetchCategoryMedicines();
    fetchAllCategories();
  }, [categoryId]);

  const fetchAllCategories = async () => {
    try {
      const res = await fetch(createApiUrl('/api/categories'));
      if (res.ok) {
        // Handle potential empty or invalid JSON responses
        let data;
        try {
          data = await res.json();
        } catch (jsonError) {
          data = []; // Use empty array as fallback
        }
        setCategories(data);
        
        if (data.length === 0) {
          toast.error('No categories found. Please create categories first.');
        }
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error) {
      toast.error('Error loading categories');
    }
  };

  const fetchCategoryMedicines = async () => {
    // Validate categoryId before making requests
    if (!categoryId || categoryId === 'undefined') {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch category details
      const categoryRes = await fetch(createApiUrl(`/api/categories/${categoryId}`));
      if (categoryRes.ok) {
        const categoryData = await categoryRes.json();
        setCategory(categoryData);
      } else {
        toast.error('Failed to load category information');
      }
      
      // Fetch medicines in this category
      const medicinesRes = await fetch(createApiUrl(`/api/medicines?category=${categoryId}&limit=100`));
      if (medicinesRes.ok) {
        const medicinesData = await medicinesRes.json();
        
        // Ensure we have a proper array of medicines
        let medicinesList = [];
        if (Array.isArray(medicinesData)) {
          medicinesList = medicinesData;
        } else if (medicinesData && Array.isArray(medicinesData.medicines)) {
          medicinesList = medicinesData.medicines;
        } else if (medicinesData && typeof medicinesData === 'object') {
          // Handle case where the response is a single object or other format
          medicinesList = [medicinesData];
        }
        
        setMedicines(medicinesList);
      } else {
        const errorText = await medicinesRes.text();
        toast.error('Failed to load medicines');
        setMedicines([]); // Set empty array on error
      }
    } catch (error) {
      toast.error('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = Array.isArray(medicines) ? medicines
    .filter(medicine => {
      // Safety check for medicine properties
      if (!medicine || typeof medicine !== 'object') {
        return false;
      }
      
      // Ensure medicine has required properties
      const name = (medicine.name || '').toString();
      const genericName = (medicine.genericName || '').toString();
      const company = (medicine.company || '').toString();
      
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                           genericName.toLowerCase().includes(search.toLowerCase()) ||
                           company.toLowerCase().includes(search.toLowerCase());
      
      const matchesStock = filterInStock === 'all' || 
                          (filterInStock === 'inStock' && medicine.inStock) ||
                          (filterInStock === 'outOfStock' && !medicine.inStock);
      
      return matchesSearch && matchesStock;
    })
    .map(medicine => {
      // Ensure all required properties exist
      return {
        _id: medicine._id,
        id: medicine.id,
        name: medicine.name || 'Unnamed Medicine',
        genericName: medicine.genericName || 'No generic name',
        company: medicine.company || 'Unknown company',
        massUnit: medicine.massUnit || 'N/A',
        image: medicine.image || 'https://placehold.co/300x225?text=No+Image',
        price: parseFloat(medicine.price) || 0,
        finalPrice: parseFloat(medicine.finalPrice) || 0,
        discountPercentage: parseFloat(medicine.discountPercentage) || 0,
        stockQuantity: parseInt(medicine.stockQuantity) || 0,
        inStock: medicine.inStock !== undefined ? medicine.inStock : true,
        ...medicine // Keep any other properties
      };
    })
    .sort((a, b) => {
      // Ensure we have valid objects to sort
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price':
          const aFinalPrice = a.finalPrice || a.price * (1 - (a.discountPercentage || 0) / 100) || 0;
          const bFinalPrice = b.finalPrice || b.price * (1 - (b.discountPercentage || 0) / 100) || 0;
          return aFinalPrice - bFinalPrice;
        case 'stock':
          return (b.stockQuantity || 0) - (a.stockQuantity || 0);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return 0;
      }
    }) : [];

  const openAddMedicineModal = () => {
    // Validate that we have a valid categoryId
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const validCategoryId = categoryId && objectIdRegex.test(categoryId) ? categoryId : '';
    
    setMedicineForm({
      name: '',
      genericName: '',
      description: '',
      image: '', // Don't set a default image URL here
      category: validCategoryId, // Pre-select current category if valid
      company: '',
      massUnit: '',
      price: '',
      unitPrice: '',
      stripPrice: '',
      discountPercentage: '0',
      stockQuantity: '1', // Default to 1 instead of 0
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

  const openEditMedicineModal = (medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name || '',
      genericName: medicine.genericName || '',
      description: medicine.description || '',
      image: medicine.image || '',
      category: medicine.category?._id || medicine.category || '',
      company: medicine.company || '',
      massUnit: medicine.massUnit || '',
      price: medicine.price || '',
      unitPrice: medicine.unitPrice || '',
      stripPrice: medicine.stripPrice || '',
      discountPercentage: medicine.discountPercentage || '0',
      stockQuantity: medicine.stockQuantity || '0',
      isAdvertised: medicine.isAdvertised || false
    });
    setEditMedicineModalOpen(true);
  };

  const closeEditMedicineModal = () => {
    setEditMedicineModalOpen(false);
    setEditingMedicine(null);
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

  // Handle add medicine
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
      toast.error('Company is required');
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
    if (!medicineForm.stockQuantity || isNaN(medicineForm.stockQuantity) || parseInt(medicineForm.stockQuantity) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const formData = {
        ...medicineForm,
        price: parseFloat(medicineForm.price),
        unitPrice: parseFloat(medicineForm.unitPrice) || 0,
        stripPrice: parseFloat(medicineForm.stripPrice) || 0,
        discountPercentage: parseInt(medicineForm.discountPercentage) || 0,
        stockQuantity: parseInt(medicineForm.stockQuantity) || 0
      };

      const res = await fetch(createApiUrl('/api/medicines'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newMedicine = await res.json();
        // Convert _id to id for frontend compatibility
        const medicineWithId = {
          ...newMedicine,
          id: newMedicine._id
        };
        setMedicines([...medicines, medicineWithId]);
        closeAddMedicineModal();
        toast.success('Medicine added successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add medicine');
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update medicine
  const handleUpdateMedicine = async (e) => {
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
      toast.error('Company is required');
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
    if (!medicineForm.stockQuantity || isNaN(medicineForm.stockQuantity) || parseInt(medicineForm.stockQuantity) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const formData = {
        ...medicineForm,
        price: parseFloat(medicineForm.price),
        unitPrice: parseFloat(medicineForm.unitPrice) || 0,
        stripPrice: parseFloat(medicineForm.stripPrice) || 0,
        discountPercentage: parseInt(medicineForm.discountPercentage) || 0,
        stockQuantity: parseInt(medicineForm.stockQuantity) || 0
      };

      const res = await fetch(createApiUrl(`/api/medicines/${editingMedicine._id || editingMedicine.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedMedicine = await res.json();
        setMedicines(medicines.map(m => 
          (m._id === editingMedicine._id || m.id === editingMedicine.id) 
            ? { ...updatedMedicine, id: updatedMedicine._id } 
            : m
        ));
        closeEditMedicineModal();
        toast.success('Medicine updated successfully!');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete medicine
  const handleDeleteMedicine = async (medicineId) => {
    if (!user) return;
    
    const medicine = medicines.find(m => m._id === medicineId || m.id === medicineId);
    if (window.confirm(`Are you sure you want to delete "${medicine?.name}"?`)) {
      try {
        const token = await user.getIdToken();
        const res = await fetch(createApiUrl(`/api/medicines/${medicineId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setMedicines(medicines.filter(m => m._id !== medicineId && m.id !== medicineId));
          toast.success('Medicine deleted successfully!');
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete medicine');
        }
      } catch (error) {
        console.error('Error deleting medicine:', error);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackNavigation}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={openAddMedicineModal}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Medicine</span>
              </Button>
              <Button
                variant="outline"
                onClick={fetchCategoryMedicines}
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <div className="w-8 h-8 flex-shrink-0">
              <Package className="w-8 h-8 text-cyan-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                {category?.name || 'Category'} Medicines
              </h1>
              <p className="text-gray-600 dark:text-gray-300 break-words">
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
            <div className="flex flex-col md:flex-row gap-4">
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
              <div className="flex flex-wrap gap-2">
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

                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
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
              <p className="text-gray-600 dark:text-gray-400 px-4">
                {search || filterInStock !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'This category doesn\'t have any medicines yet.'}
              </p>
              <div className="mt-6">
                <Button onClick={openAddMedicineModal} className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Add Your First Medicine
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredMedicines.map((medicine) => {
              // Additional safety check
              if (!medicine) return null;
              
              const medicineId = medicine._id || medicine.id;
              if (!medicineId) {
                return null;
              }
              
              return (
                <Card key={`grid-${medicineId}`} className="group hover:shadow-lg transition-all duration-300 medicine-grid-card overflow-hidden h-full flex flex-col">
                  <CardContent className="p-4 sm:p-6 card-content flex flex-col flex-grow">
                    <div className="mb-4 flex-shrink-0">
                      <div className="medicine-image-container">
                        <img
                          src={medicine.image || 'https://placehold.co/300x225?text=No+Image'}
                          alt={medicine.name || 'Medicine'}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x225?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex items-start justify-between mb-2 mt-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight break-words max-w-[70%]">
                          {medicine.name || 'Unnamed Medicine'}
                        </h3>
                        <Badge variant={medicine.inStock ? 'default' : 'secondary'} className="ml-2 flex-shrink-0 text-xs px-2 py-1">
                          {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 break-words">
                        {medicine.genericName || 'No generic name'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 break-words">
                        {medicine.company || 'Unknown company'} • {medicine.massUnit || 'N/A'}
                      </p>
                    </div>

                    <div className="mb-4 flex-shrink-0">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex flex-wrap items-center gap-1">
                          {medicine.discountPercentage > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              ৳{((medicine.price || 0).toFixed(2))}
                            </span>
                          )}
                          <span className="text-lg font-bold text-green-600">
                            ৳{((medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100) || 0).toFixed(2))}
                          </span>
                        </div>
                        {medicine.discountPercentage > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">
                            {medicine.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Stock: {medicine.stockQuantity || 0} units
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 card-actions mt-auto">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 min-w-[50px] text-xs py-1 px-2 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          const id = medicine._id || medicine.id;
                          if (id) {
                            navigate(`/medicine/${id}`);
                          } else {
                            toast.error('Cannot view medicine: Invalid ID');
                          }
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="truncate hidden xs:inline">View</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="min-w-[32px] text-xs py-1 px-2 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditMedicineModal(medicine);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={medicine.inStock ? "outline" : "default"}
                        className="min-w-[32px] text-xs py-1 px-2 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          const id = medicine._id || medicine.id;
                          if (id) {
                            toggleMedicineStatus(id, medicine.inStock);
                          } else {
                            toast.error('Cannot update medicine: Invalid ID');
                          }
                        }}
                      >
                        {medicine.inStock ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 min-w-[32px] text-xs py-1 px-2 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          const id = medicine._id || medicine.id;
                          if (id) {
                            deleteMedicine(id);
                          } else {
                            toast.error('Cannot delete medicine: Invalid ID');
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto responsive-table-container">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="text-left p-4 font-medium">Medicine</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Company</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium hidden sm:table-cell">Stock</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((medicine) => {
                      // Additional safety check
                      if (!medicine) return null;
                      
                      const medicineId = medicine._id || medicine.id;
                      if (!medicineId) {
                        return null;
                      }
                      
                      return (
                        <tr key={`list-${medicineId}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 overflow-hidden rounded flex-shrink-0">
                                <img
                                  src={medicine.image || 'https://placehold.co/50x50?text=No+Image'}
                                  alt={medicine.name || 'Medicine'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://placehold.co/50x50?text=No+Image';
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                  {medicine.name || 'Unnamed Medicine'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 md:hidden truncate">
                                  {medicine.company || 'Unknown company'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 md:hidden truncate">
                                  Stock: {medicine.stockQuantity || 0} units
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                            {medicine.company || 'Unknown company'}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-green-600">
                                ৳{((medicine.finalPrice || medicine.price * (1 - (medicine.discountPercentage || 0) / 100) || 0).toFixed(2))}
                              </span>
                              {medicine.discountPercentage > 0 && (
                                <span className="text-xs text-gray-500 line-through">
                                  ৳{((medicine.price || 0).toFixed(2))}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                            {medicine.stockQuantity || 0} units
                          </td>
                          <td className="p-4">
                            <Badge variant={medicine.inStock ? 'default' : 'secondary'}>
                              {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const id = medicine._id || medicine.id;
                                  if (id) {
                                    navigate(`/medicine/${id}`);
                                  } else {
                                    toast.error('Cannot view medicine: Invalid ID');
                                  }
                                }}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openEditMedicineModal(medicine)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={medicine.inStock ? "outline" : "default"}
                                onClick={() => {
                                  const id = medicine._id || medicine.id;
                                  if (id) {
                                    toggleMedicineStatus(id, medicine.inStock);
                                  } else {
                                    toast.error('Cannot update medicine: Invalid ID');
                                  }
                                }}
                              >
                                {medicine.inStock ? (
                                  <XCircle className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  const id = medicine._id || medicine.id;
                                  if (id) {
                                    deleteMedicine(id);
                                  } else {
                                    toast.error('Cannot delete medicine: Invalid ID');
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                  <SelectValue placeholder={categories.length === 0 ? "No categories available" : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <SelectItem key="no-categories" value="" disabled>
                      No categories found. Create categories first.
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={`add-${cat._id || cat.id}`} value={cat._id || cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {categories.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No categories available. Please create categories first before adding medicines.
                </p>
              )}
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

            {/* Medicine Image Section */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900">Medicine Image</h4>
              
              {/* File Upload */}
              <div>
                <Label htmlFor="imageFile" className="text-sm font-medium">
                  Upload Image File
                </Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMedicineForm(prev => ({ ...prev, imageFile: e.target.files[0] }))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image file (JPEG, PNG, GIF, WebP). Maximum size: 5MB.
                  {medicineForm.imageFile && (
                    <span className="text-green-600 font-medium">
                      {' '}Selected: {medicineForm.imageFile.name}
                    </span>
                  )}
                </p>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs text-gray-500 px-2 bg-gray-50">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="image" className="text-sm font-medium">
                  Medicine Image URL
                </Label>
                <Input
                  id="image"
                  type="url"
                  value={medicineForm.image}
                  onChange={(e) => setMedicineForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Enter image URL (e.g., https://example.com/medicine-image.jpg)"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a direct URL to the medicine image.
                </p>
              </div>
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
                disabled={isSubmitting || isUploadingImage}
                className="flex items-center gap-2"
              >
                {isSubmitting || isUploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isUploadingImage ? 'Uploading Image...' : 'Adding Medicine...'}
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

      {/* Edit Medicine Modal */}
      <Dialog open={editMedicineModalOpen} onOpenChange={closeEditMedicineModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Medicine</DialogTitle>
            <DialogDescription>
              Update the details below to edit this medicine.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={updateMedicine} className="space-y-4">
            {/* Medicine Name */}
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Medicine Name *
              </Label>
              <Input
                id="edit-name"
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
              <Label htmlFor="edit-genericName" className="text-sm font-medium">
                Generic Name
              </Label>
              <Input
                id="edit-genericName"
                type="text"
                value={medicineForm.genericName}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, genericName: e.target.value }))}
                placeholder="Enter generic name"
                className="mt-1"
              />
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium">
                Category *
              </Label>
              <Select value={medicineForm.category} onValueChange={(value) => setMedicineForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={`edit-${cat._id || cat.id}`} value={cat._id || cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Brief Description
              </Label>
              <Textarea
                id="edit-description"
                value={medicineForm.description}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter medicine description"
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="edit-company" className="text-sm font-medium">
                Company
              </Label>
              <Input
                id="edit-company"
                type="text"
                value={medicineForm.company}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>

            {/* Mass Unit */}
            <div>
              <Label htmlFor="edit-massUnit" className="text-sm font-medium">
                Mass Unit
              </Label>
              <Input
                id="edit-massUnit"
                type="text"
                value={medicineForm.massUnit}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, massUnit: e.target.value }))}
                placeholder="e.g., 500mg, 10ml"
                className="mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="edit-price" className="text-sm font-medium">
                Price (৳) *
              </Label>
              <Input
                id="edit-price"
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
              <Label htmlFor="edit-unitPrice" className="text-sm font-medium">
                Unit Price (৳)
              </Label>
              <Input
                id="edit-unitPrice"
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
              <Label htmlFor="edit-stripPrice" className="text-sm font-medium">
                Strip Price (৳)
              </Label>
              <Input
                id="edit-stripPrice"
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
              <Label htmlFor="edit-discountPercentage" className="text-sm font-medium">
                Discount Percentage (%)
              </Label>
              <Input
                id="edit-discountPercentage"
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
              <Label htmlFor="edit-stockQuantity" className="text-sm font-medium">
                Stock Quantity *
              </Label>
              <Input
                id="edit-stockQuantity"
                type="number"
                min="0"
                value={medicineForm.stockQuantity}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                placeholder="Enter quantity"
                required
                className="mt-1"
              />
            </div>

            {/* Medicine Image Section */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900">Medicine Image</h4>
              
              {/* File Upload */}
              <div>
                <Label htmlFor="edit-imageFile" className="text-sm font-medium">
                  Upload Image File
                </Label>
                <Input
                  id="edit-imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMedicineForm(prev => ({ ...prev, imageFile: e.target.files[0] }))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image file (JPEG, PNG, GIF, WebP). Maximum size: 5MB.
                  {medicineForm.imageFile && (
                    <span className="text-green-600 font-medium">
                      {' '}Selected: {medicineForm.imageFile.name}
                    </span>
                  )}
                </p>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs text-gray-500 px-2 bg-gray-50">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="edit-image" className="text-sm font-medium">
                  Medicine Image URL
                </Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={medicineForm.image}
                  onChange={(e) => setMedicineForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Enter image URL (e.g., https://example.com/medicine-image.jpg)"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a direct URL to the medicine image.
                </p>
              </div>
            </div>

            {/* Advertised Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdvertised"
                checked={medicineForm.isAdvertised}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, isAdvertised: e.target.checked }))}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <Label htmlFor="isAdvertised" className="text-sm font-medium">
                Advertised Medicine
              </Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditMedicineModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="flex items-center gap-2"
              >
                {isSubmitting || isUploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isUploadingImage ? 'Uploading Image...' : 'Updating Medicine...'}
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Update Medicine
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