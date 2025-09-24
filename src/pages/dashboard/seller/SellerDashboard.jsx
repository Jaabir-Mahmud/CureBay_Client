import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  Package, 
  CreditCard, 
  TrendingUp,
  Search,
  Filter,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { useAuth } from '../../../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema for medicine form
const medicineSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Medicine name must be at least 2 characters')
    .max(100, 'Medicine name must be less than 100 characters')
    .required('Medicine name is required'),
  genericName: yup
    .string()
    .min(2, 'Generic name must be at least 2 characters')
    .max(100, 'Generic name must be less than 100 characters')
    .required('Generic name is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  category: yup
    .string()
    .required('Category is required')
    .test('is-valid-category', 'Please select a valid category', function(value) {
      // Validate that a valid category is selected (not placeholder values)
      return value && !value.startsWith('__') && value !== '';
    }),
  company: yup
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(50, 'Company name must be less than 50 characters')
    .required('Company name is required'),
  massUnit: yup
    .string()
    .required('Mass unit is required'),
  price: yup
    .number()
    .positive('Price must be a positive number')
    .max(10000, 'Price must be less than $10,000')
    .required('Price is required')
    .typeError('Price must be a number'),
  discountPercentage: yup
    .number()
    .min(0, 'Discount percentage cannot be negative')
    .max(100, 'Discount percentage cannot exceed 100%')
    .required('Discount percentage is required')
    .typeError('Discount percentage must be a number'),
}).test('image-required', 'Medicine image is required', function() {
  // This custom test will always pass in yup validation
  // We'll handle image validation in the submit function
  return true;
});

const SellerDashboard = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [medicineImage, setMedicineImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [imageError, setImageError] = useState('');
  
  // Use the MongoDB ObjectId from profile as sellerId, not the Firebase UID
  const sellerId = profile?._id;
  
  // Debug logging
  useEffect(() => {
    console.log('Auth state:', { user, profile, loading, sellerId });
  }, [user, profile, loading, sellerId]);
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger
  } = useForm({
    resolver: yupResolver(medicineSchema),
    defaultValues: {
      name: '',
      genericName: '',
      description: '',
      category: '',  // This should be an empty string initially
      company: '',
      massUnit: 'mg',
      price: 0,
      discountPercentage: 0,
    },
  });
  
  // Watch the category value for controlled component
  const selectedCategory = watch('category');
  const selectedMassUnit = watch('massUnit');
  // We'll track image separately using state

  const { data: medicinesData, isLoading: medicinesLoading, refetch: refetchMedicines } = useQuery({
    queryKey: ['sellerMedicines', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const response = await fetch(`/api/medicines?sellerId=${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return response.json();
    },
    enabled: !!sellerId // Only enable when we have a valid sellerId
  });

  // Fetch seller's payment history
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['sellerPayments', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const response = await fetch(`/api/payments/seller/${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
    enabled: !!sellerId // Only enable when we have a valid sellerId
  });

  // Fetch categories for dropdown
  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      console.log('Categories API response:', data); // Debug log
      return data;
    }
  });

  // Log any category fetching errors
  useEffect(() => {
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      toast.error('Failed to load categories');
    }
  }, [categoriesError]);

  const medicines = medicinesData?.medicines || [];
  const payments = paymentsData?.payments || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
  
  // Debug log for categories
  useEffect(() => {
    console.log('Categories loaded:', categories);
    if (categories && categories.length > 0) {
      console.log('First category:', categories[0]);
    }
  }, [categories]);
  
  // Log when categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      console.log('Categories updated, count:', categories.length);
    }
  }, [categories]);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMedicines = medicines.length;
  const activeMedicines = medicines.filter(m => m.isActive !== false).length;

  // Handle medicine image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear any previous image error
      setImageError('');
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        setImageError('Image must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        setImageError('Please select an image file');
        return;
      }
      
      setMedicineImage(file);
    }
  };

  // Upload medicine image
  const uploadMedicineImage = async () => {
    if (!medicineImage) return null;
    
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('photo', medicineImage);
      
      console.log('Uploading image:', medicineImage);
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Upload error response:', errorData);
        } catch (jsonError) {
          console.error('Failed to parse JSON error response:', jsonError);
          const errorText = await response.text();
          console.error('Raw error response:', errorText);
          throw new Error(`Failed to upload image: ${response.status} ${response.statusText} - ${errorText}`);
        }
        throw new Error(errorData.error || errorData.message || 'Failed to upload image');
      }
      
      let data;
      try {
        data = await response.json();
        console.log('Upload success response:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Failed to upload image - Invalid server response');
      }
      return data.url; // Return the file URL
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload medicine image');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Debug logging
      console.log('Form submission started', { user, profile, sellerId });
      
      // Validate that category is selected
      if (!data.category || data.category.startsWith('__') || data.category === '') {
        toast.error('Please select a valid category');
        return;
      }
      
      // Validate that an image is provided
      if (!medicineImage) {
        toast.error('Medicine image is required');
        setImageError('Medicine image is required');
        return;
      }
      
      // Validate that we have a sellerId
      if (!sellerId) {
        console.error('Seller ID not available', { user, profile, loading });
        toast.error('Seller information not available. Please refresh the page.');
        return;
      }
      
      // Additional validation to ensure profile has required fields
      if (!profile || !profile._id || !profile.role || profile.role !== 'seller') {
        console.error('Invalid seller profile', { profile });
        toast(
          (t) => (
            <div>
              <p>Seller information is invalid. Try refreshing your profile.</p>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => {
                    refreshProfile();
                    toast.dismiss(t.id);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Refresh
                </button>
                <button 
                  onClick={() => toast.dismiss(t.id)}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          { duration: 10000 }
        );
        return;
      }
      
      // Upload image first if provided
      let imageUrl = null;
      if (medicineImage) {
        imageUrl = await uploadMedicineImage();
        if (!imageUrl) {
          toast.error('Failed to upload medicine image');
          return;
        }
      }
      
      // Prepare medicine data - ensure proper data types
      const medicineData = {
        ...data,
        seller: sellerId, // Use the MongoDB ObjectId
        image: imageUrl, // Use uploaded image URL (now guaranteed to exist)
        price: parseFloat(data.price), // Ensure price is a number
        discountPercentage: parseInt(data.discountPercentage) || 0 // Ensure discount is an integer
      };

      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medicineData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to add medicine';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, use the text as error message
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      toast.success('Medicine added successfully');
      setIsAddMedicineOpen(false);
      reset(); // Reset form using React Hook Form
      setMedicineImage(null); // Clear image
      setImageError(''); // Clear image error
      refetchMedicines();
    } catch (error) {
      toast.error(error.message || 'Failed to add medicine');
      console.error('Error adding medicine:', error);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    try {
      const response = await fetch(`/api/medicines/${medicineId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete medicine');
      
      toast.success('Medicine deleted successfully');
      refetchMedicines();
    } catch (error) {
      toast.error('Failed to delete medicine');
      console.error('Error deleting medicine:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
      case 'paid':
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'failed':
      case 'inactive':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading seller dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Please log in to view your seller dashboard.</p>
      </div>
    );
  }
  
  // Check if user is a seller
  if (profile && profile.role !== 'seller') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Access denied. This dashboard is only available for sellers.</p>
      </div>
    );
  }
  
  // Check if seller profile is complete
  if (!profile || !profile._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Seller profile not found or incomplete.</p>
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
            <button 
              onClick={refreshProfile}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Refresh Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your medicines and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From paid orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMedicines}</div>
              <p className="text-xs text-muted-foreground">In your catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Medicines</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMedicines}</div>
              <p className="text-xs text-muted-foreground">Currently selling</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="medicines" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medicines">Manage Medicines</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
          </TabsList>

          {/* Medicines Tab */}
          <TabsContent value="medicines">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Your Medicines</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Manage your medicine inventory
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Dialog open={isAddMedicineOpen} onOpenChange={(open) => {
                      setIsAddMedicineOpen(open);
                      if (!open) {
                        // Clear form and image when dialog is closed
                        reset();
                        setMedicineImage(null);
                        setImageError('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Medicine
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Medicine</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit((data) => {
                          console.log('Form submitted with data:', data);
                          return onSubmit(data);
                        })} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Medicine Name</Label>
                            <Input
                              id="name"
                              className={errors.name ? 'border-red-500' : ''}
                              {...register('name')}
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="genericName">Generic Name</Label>
                            <Input
                              id="genericName"
                              className={errors.genericName ? 'border-red-500' : ''}
                              {...register('genericName')}
                            />
                            {errors.genericName && (
                              <p className="text-red-500 text-sm mt-1">{errors.genericName.message}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              rows={3}
                              className={errors.description ? 'border-red-500' : ''}
                              {...register('description')}
                            />
                            {errors.description && (
                              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">Category *</Label>
                              <Select 
                                value={selectedCategory || ""}
                                onValueChange={(value) => {
                                  setValue('category', value, { shouldValidate: true });
                                  // Reset search when a category is selected
                                  setCategorySearchTerm('');
                                }}
                                onOpenChange={(open) => {
                                  // Reset search when dropdown is closed
                                  if (!open) {
                                    setCategorySearchTerm('');
                                  }
                                }}
                              >
                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categoriesLoading ? (
                                    <SelectItem value="__loading__" disabled>
                                      Loading categories...
                                    </SelectItem>
                                  ) : categoriesError ? (
                                    <SelectItem value="__error__" disabled>
                                      Failed to load categories
                                    </SelectItem>
                                  ) : (
                                    <>
                                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                        <Input
                                          placeholder="Search categories..."
                                          value={categorySearchTerm}
                                          onChange={(e) => setCategorySearchTerm(e.target.value)}
                                          className="h-8 text-sm"
                                        />
                                      </div>
                                      {filteredCategories.length === 0 ? (
                                        <SelectItem value="__empty__" disabled>
                                          No categories found
                                        </SelectItem>
                                      ) : (
                                        <>
                                          <SelectItem value="__placeholder__" disabled>
                                            Select a category
                                          </SelectItem>
                                          {filteredCategories.map(category => (
                                            <SelectItem 
                                              key={category._id} 
                                              value={category._id}
                                            >
                                              {category.name}
                                            </SelectItem>
                                          ))}
                                        </>
                                      )}
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                              {errors.category && (
                                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                className={errors.company ? 'border-red-500' : ''}
                                {...register('company')}
                              />
                              {errors.company && (
                                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">Price ($)</Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.01"
                                className={errors.price ? 'border-red-500' : ''}
                                {...register('price')}
                              />
                              {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="discountPercentage">Discount %</Label>
                              <Input
                                id="discountPercentage"
                                type="number"
                                min="0"
                                max="100"
                                className={errors.discountPercentage ? 'border-red-500' : ''}
                                {...register('discountPercentage')}
                              />
                              {errors.discountPercentage && (
                                <p className="text-red-500 text-sm mt-1">{errors.discountPercentage.message}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="massUnit">Mass Unit *</Label>
                            <Select 
                              value={selectedMassUnit} 
                              onValueChange={(value) => {
                                setValue('massUnit', value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select mass unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mg">mg</SelectItem>
                                <SelectItem value="g">g</SelectItem>
                                <SelectItem value="ml">ml</SelectItem>
                                <SelectItem value="tablets">tablets</SelectItem>
                                <SelectItem value="capsules">capsules</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="image">Medicine Image *</Label>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className={imageError ? 'border-red-500' : ''}
                            />
                            {imageError && (
                              <p className="text-red-500 text-sm mt-1">{imageError}</p>
                            )}
                            {isUploadingImage && (
                              <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setIsAddMedicineOpen(false);
                                reset();
                                setMedicineImage(null);
                                setImageError('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={isSubmitting || isUploadingImage}
                            >
                              {isSubmitting || isUploadingImage ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  {isUploadingImage ? 'Uploading...' : 'Adding...'}
                                </span>
                              ) : (
                                'Add Medicine'
                              )}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {medicinesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">Loading medicines...</p>
                  </div>
                ) : filteredMedicines.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {searchTerm ? 'No medicines match your search' : 'No medicines added yet'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Medicine
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredMedicines.map((medicine) => (
                          <tr key={medicine._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {medicine.image && (
                                  <img
                                    src={medicine.image}
                                    alt={medicine.name}
                                    className="h-10 w-10 rounded-md object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {medicine.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {medicine.genericName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                {medicine.category?.name || 'N/A'}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                ${medicine.price}
                                {medicine.discountPercentage > 0 && (
                                  <span className="text-xs text-green-600 ml-1">(-{medicine.discountPercentage}%)</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteMedicine(medicine._id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Track payments for your medicine sales
                </p>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">Loading payments...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-300">No payments found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {payments.map((payment) => (
                          <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {payment.transactionId || 'N/A'}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                ${payment.amount ? payment.amount.toFixed(2) : '0.00'}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge className={`text-xs ${getStatusColor(payment.paymentStatus || payment.status)}`}>
                                {payment.paymentStatus || payment.status || 'N/A'}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {payment.createdAt ? format(new Date(payment.createdAt), 'MMM dd, yyyy') : 'N/A'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advertisements Tab */}
          <TabsContent value="advertisements">
            <Card>
              <CardHeader>
                <CardTitle>Advertisement Requests</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Request advertisements for your medicines
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Advertisement features coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;