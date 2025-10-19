import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Percent,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

function CouponsTab() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [couponSearch, setCouponSearch] = useState('');
  const [couponStatusFilter, setCouponStatusFilter] = useState('all'); // all, active, inactive, expired
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    usageLimit: null,
    startDate: '',
    endDate: '',
    isActive: true,
    applicableCategories: [],
    applicableMedicines: []
  });
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch all coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };
        
        // Add development header if in development mode
        if (process.env.NODE_ENV === 'development') {
          headers['x-local-test'] = 'true';
        }
        
        const response = await fetch('/api/coupons', {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          // Ensure we're setting the coupons array correctly
          setCoupons(Array.isArray(data.coupons) ? data.coupons : (Array.isArray(data) ? data : []));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch coupons');
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
        toast.error(error.message || 'Failed to load coupons');
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCoupons();
    }
  }, [user]);

  const openCouponModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponForm({
        code: coupon.code || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue || 0,
        minimumOrderAmount: coupon.minimumOrderAmount || 0,
        maximumDiscountAmount: coupon.maximumDiscountAmount || null,
        usageLimit: coupon.usageLimit || null,
        startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
        endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
        isActive: coupon.isActive || false,
        applicableCategories: coupon.applicableCategories || [],
        applicableMedicines: coupon.applicableMedicines || []
      });
    } else {
      setEditingCoupon(null);
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minimumOrderAmount: 0,
        maximumDiscountAmount: null,
        usageLimit: null,
        startDate: '',
        endDate: '',
        isActive: true,
        applicableCategories: [],
        applicableMedicines: []
      });
    }
    setCouponModalOpen(true);
  };

  const saveCoupon = async () => {
    if (!user) {
      toast.error('Invalid user');
      return;
    }

    // Validate required fields
    if (!couponForm.code.trim()) {
      toast.error('Coupon code is required');
      return;
    }

    if (!couponForm.startDate || !couponForm.endDate) {
      toast.error('Start date and end date are required');
      return;
    }

    const startDate = new Date(couponForm.startDate);
    const endDate = new Date(couponForm.endDate);
    
    if (startDate >= endDate) {
      toast.error('End date must be after start date');
      return;
    }

    if (couponForm.discountValue <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    setIsSavingCoupon(true);
    try {
      const token = await user.getIdToken();
      const method = editingCoupon ? 'PUT' : 'POST';
      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Add development header if in development mode
      if (process.env.NODE_ENV === 'development') {
        headers['x-local-test'] = 'true';
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...couponForm,
          maximumDiscountAmount: couponForm.maximumDiscountAmount || null,
          usageLimit: couponForm.usageLimit || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingCoupon ? 'update' : 'create'} coupon`);
      }

      const updatedCoupon = await response.json();
      
      if (editingCoupon) {
        // Update existing coupon
        setCoupons(prevCoupons => 
          prevCoupons.map(coupon => 
            coupon._id === editingCoupon._id ? updatedCoupon : coupon
          )
        );
      } else {
        // Add new coupon
        setCoupons(prevCoupons => [...prevCoupons, updatedCoupon]);
      }
      
      toast.success(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`);
      setCouponModalOpen(false);
      
    } catch (error) {
      console.error(`Error ${editingCoupon ? 'updating' : 'creating'} coupon:`, error);
      toast.error(error.message || `Failed to ${editingCoupon ? 'update' : 'create'} coupon. Please try again.`);
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!user || !couponId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this coupon?');
    if (!confirmed) return;
    
    try {
      const token = await user.getIdToken();
      
      // Prepare headers
      const headers = { Authorization: `Bearer ${token}` };
      
      // Add development header if in development mode
      if (process.env.NODE_ENV === 'development') {
        headers['x-local-test'] = 'true';
      }
      
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete coupon');
      }
      
      setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon._id !== couponId));
      toast.success('Coupon deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error(error.message || 'Failed to delete coupon. Please try again.');
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = couponSearch === '' || 
      coupon.code.toLowerCase().includes(couponSearch.toLowerCase());
    
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    const isExpired = endDate < currentDate;
    const isStarted = startDate <= currentDate;
    
    let matchesStatus = true;
    switch (couponStatusFilter) {
      case 'active':
        matchesStatus = coupon.isActive && isStarted && !isExpired;
        break;
      case 'inactive':
        matchesStatus = !coupon.isActive;
        break;
      case 'expired':
        matchesStatus = isExpired;
        break;
      case 'scheduled':
        matchesStatus = isStarted === false;
        break;
      default:
        matchesStatus = true;
    }
    
    return matchesSearch && matchesStatus;
  });

  const displayedCoupons = showAll ? filteredCoupons : filteredCoupons.slice(0, 50);

  const getCouponStatusColor = (coupon) => {
    if (!coupon.isActive) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
    
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    const isExpired = endDate < currentDate;
    const isStarted = startDate <= currentDate;
    
    if (isExpired) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    }
    
    if (!isStarted) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
    
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getCouponStatusText = (coupon) => {
    if (!coupon.isActive) {
      return 'Inactive';
    }
    
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    const isExpired = endDate < currentDate;
    const isStarted = startDate <= currentDate;
    
    if (isExpired) {
      return 'Expired';
    }
    
    if (!isStarted) {
      return 'Scheduled';
    }
    
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Coupon Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Create and manage discount coupons
          </p>
        </div>
        
        <Button onClick={() => openCouponModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search coupons..."
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={couponStatusFilter} onValueChange={setCouponStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coupons</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coupon Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Coupons</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {coupons.length}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-full">
                <Ticket className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Coupons</p>
                <p className="text-2xl font-bold text-green-600">
                  {coupons.filter(c => {
                    const currentDate = new Date();
                    const startDate = new Date(c.startDate);
                    const endDate = new Date(c.endDate);
                    return c.isActive && startDate <= currentDate && endDate >= currentDate;
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Percentage Off</p>
                <p className="text-2xl font-bold text-purple-600">
                  {coupons.filter(c => c.discountType === 'percentage').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fixed Amount</p>
                <p className="text-2xl font-bold text-orange-600">
                  {coupons.filter(c => c.discountType === 'fixed').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Coupons ({filteredCoupons.length})</span>
            {filteredCoupons.length > 50 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show All (${filteredCoupons.length})`}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No coupons found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {couponSearch || couponStatusFilter !== 'all'
                  ? 'Try adjusting your search and filters.'
                  : 'Create your first coupon to get started.'}
              </p>
              <Button onClick={() => openCouponModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Coupon
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedCoupons.map((coupon) => (
                <div 
                  key={coupon._id} 
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Coupon Details */}
                    <div className="lg:w-3/4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {coupon.code}
                            </h3>
                            <Badge className={`${getCouponStatusColor(coupon)} flex items-center gap-1`}>
                              {getCouponStatusText(coupon)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Tag className="w-4 h-4" />
                              <span>
                                {coupon.discountType === 'percentage' 
                                  ? `${coupon.discountValue}% OFF` 
                                  : `$${coupon.discountValue} OFF`}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <DollarSign className="w-4 h-4" />
                              <span>
                                Min. Order: ${coupon.minimumOrderAmount || 0}
                              </span>
                            </div>
                            
                            {coupon.maximumDiscountAmount && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span>
                                  Max. Discount: ৳{coupon.maximumDiscountAmount}
                                </span>
                              </div>
                            )}
                            
                            {coupon.usageLimit && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span>
                                  Used: {coupon.usedCount || 0}/{coupon.usageLimit}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>
                {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2 min-w-0 sm:min-w-[180px]">
                          <Button
                            onClick={() => openCouponModal(coupon)}
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            onClick={() => deleteCoupon(coupon._id)}
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coupon Modal */}
      <Dialog open={couponModalOpen} onOpenChange={setCouponModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon 
                ? `Editing coupon ${editingCoupon.code}` 
                : 'Create a new discount coupon'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coupon-code">Coupon Code *</Label>
                <Input
                  id="coupon-code"
                  placeholder="e.g. SAVE20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                  disabled={!!editingCoupon}
                />
                <p className="text-xs text-gray-500 mt-1">Unique code for the coupon</p>
              </div>
              
              <div>
                <Label htmlFor="discount-type">Discount Type *</Label>
                <Select 
                  value={couponForm.discountType} 
                  onValueChange={(value) => setCouponForm({...couponForm, discountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount-value">
                  {couponForm.discountType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
                </Label>
                <div className="relative">
                  <Input
                    id="discount-value"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({...couponForm, discountValue: parseFloat(e.target.value) || 0})}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {couponForm.discountType === 'percentage' ? '%' : '৳'}
                  </span>
                </div>
              </div>
              
              {couponForm.discountType === 'percentage' && (
                <div>
                  <Label htmlFor="max-discount">Maximum Discount Amount</Label>
                  <div className="relative">
                    <Input
                      id="max-discount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="No limit"
                      value={couponForm.maximumDiscountAmount || ''}
                      onChange={(e) => setCouponForm({...couponForm, maximumDiscountAmount: e.target.value ? parseFloat(e.target.value) : null})}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum discount amount (optional)</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-order">Minimum Order Amount</Label>
                <div className="relative">
                  <Input
                    id="min-order"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={couponForm.minimumOrderAmount}
                    onChange={(e) => setCouponForm({...couponForm, minimumOrderAmount: parseFloat(e.target.value) || 0})}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum order amount to apply coupon</p>
              </div>
              
              <div>
                <Label htmlFor="usage-limit">Usage Limit</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={couponForm.usageLimit || ''}
                  onChange={(e) => setCouponForm({...couponForm, usageLimit: e.target.value ? parseInt(e.target.value) : null})}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of times coupon can be used</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date *</Label>
                <div className="relative">
                  <Input
                    id="start-date"
                    type="date"
                    value={couponForm.startDate}
                    onChange={(e) => setCouponForm({...couponForm, startDate: e.target.value})}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="end-date">End Date *</Label>
                <div className="relative">
                  <Input
                    id="end-date"
                    type="date"
                    value={couponForm.endDate}
                    onChange={(e) => setCouponForm({...couponForm, endDate: e.target.value})}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="coupon-active"
                checked={couponForm.isActive}
                onChange={(e) => setCouponForm({...couponForm, isActive: e.target.checked})}
                className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <Label htmlFor="coupon-active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCouponModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveCoupon} 
              disabled={isSavingCoupon}
            >
              {isSavingCoupon ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                editingCoupon ? 'Update Coupon' : 'Create Coupon'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CouponsTab;