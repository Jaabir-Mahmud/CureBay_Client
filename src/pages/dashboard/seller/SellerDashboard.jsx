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
    .required('Category is required'),
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
    .required('Price is required'),
  discountPercentage: yup
    .number()
    .min(0, 'Discount percentage cannot be negative')
    .max(100, 'Discount percentage cannot exceed 100%')
    .default(0),
});

const SellerDashboard = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(medicineSchema),
    defaultValues: {
      name: '',
      genericName: '',
      description: '',
      category: '',
      company: '',
      massUnit: 'mg',
      price: '',
      discountPercentage: 0,
    },
  });

  // Watch the category value for controlled component
  const selectedCategory = watch('category');
  const selectedMassUnit = watch('massUnit');

  const sellerId = profile?.id || user?.uid;

  // Fetch seller's medicines
  const { data: medicinesData, isLoading: medicinesLoading, refetch: refetchMedicines } = useQuery({
    queryKey: ['sellerMedicines', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const response = await fetch(`/api/medicines?sellerId=${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return response.json();
    },
    enabled: !!sellerId
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
    enabled: !!sellerId
  });

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const medicines = medicinesData?.medicines || [];
  const payments = paymentsData?.payments || [];
  const categories = categoriesData?.categories || [];

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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      
      // Add seller ID
      formData.append('seller', sellerId);

      const response = await fetch('/api/medicines', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to add medicine');
      
      toast.success('Medicine added successfully');
      setIsAddMedicineOpen(false);
      reset(); // Reset form using React Hook Form
      refetchMedicines();
    } catch (error) {
      toast.error('Failed to add medicine');
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Please log in to view your seller dashboard.</p>
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
                    <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
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
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                              <Label htmlFor="category">Category</Label>
                              <Select 
                                value={selectedCategory} 
                                onValueChange={(value) => setValue('category', value)}
                              >
                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category._id} value={category._id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
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
                                {...register('price', { valueAsNumber: true })}
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
                                {...register('discountPercentage', { valueAsNumber: true })}
                              />
                              {errors.discountPercentage && (
                                <p className="text-red-500 text-sm mt-1">{errors.discountPercentage.message}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="massUnit">Mass Unit</Label>
                            <Select 
                              value={selectedMassUnit} 
                              onValueChange={(value) => setValue('massUnit', value)}
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
                            <Label htmlFor="image">Medicine Image</Label>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setIsAddMedicineOpen(false);
                                reset();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Adding...
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
                                {payment.transactionId}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                ${payment.amount.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
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