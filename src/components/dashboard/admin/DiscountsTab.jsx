import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Calendar
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
import { createApiUrl } from '../../../lib/utils';

function DiscountsTab() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]); // Add this line
  const [discountSearch, setDiscountSearch] = useState('');
  const [discountStatusFilter, setDiscountStatusFilter] = useState('all'); // all, active, inactive
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectingMedicine, setSelectingMedicine] = useState(false); // Add this line
  const [discountForm, setDiscountForm] = useState({
    discountPercentage: 0,
    isActive: true,
    discountStartDate: '',
    discountEndDate: ''
  });
  const [isSavingDiscount, setIsSavingDiscount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch discounted medicines with limit
  useEffect(() => {
    const fetchDiscountedMedicines = async () => {
      try {
        setLoading(true);
        // Fetch up to 100 discounted medicines to ensure we get all of them
        const response = await fetch(createApiUrl('/api/medicines/discounted?limit=100'));
        if (response.ok) {
          const data = await response.json();
          // Validate that we're only getting valid medicines
          const validMedicines = Array.isArray(data.medicines) 
            ? data.medicines.filter(medicine => 
                medicine && medicine._id && medicine.name
              )
            : [];
          setMedicines(validMedicines);
        } else {
          throw new Error('Failed to fetch discounted medicines');
        }
      } catch (error) {
        toast.error('Failed to load discounted medicines');
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedMedicines();
  }, []);

  // Add this function to fetch all medicines
  const fetchAllMedicines = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(createApiUrl('/api/medicines?limit=1000'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter out any invalid medicines
        const validMedicines = Array.isArray(data.medicines) 
          ? data.medicines.filter(medicine => 
              medicine && medicine._id && medicine.name
            )
          : [];
        setAllMedicines(validMedicines);
      } else {
        throw new Error('Failed to fetch all medicines');
      }
    } catch (error) {
      toast.error('Failed to load medicines');
      setAllMedicines([]);
    }
  };

  const openDiscountModal = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setDiscountForm({
        discountPercentage: medicine.discountPercentage || 0,
        isActive: medicine.discountPercentage > 0,
        discountStartDate: medicine.discountStartDate || '',
        discountEndDate: medicine.discountEndDate || ''
      });
      setSelectingMedicine(false);
    } else {
      // When adding a new discount, we need to select a medicine first
      setEditingMedicine(null);
      setDiscountForm({
        discountPercentage: 0,
        isActive: true,
        discountStartDate: '',
        discountEndDate: ''
      });
      setSelectingMedicine(true);
      // Fetch all medicines if not already fetched
      if (allMedicines.length === 0) {
        fetchAllMedicines();
      }
    }
    setDiscountModalOpen(true);
  };

  const saveDiscount = async () => {
    if (!editingMedicine || !user) {
      toast.error('Invalid medicine or user');
      return;
    }

    // Validate discount percentage
    const discountValue = parseInt(discountForm.discountPercentage);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      toast.error('Discount percentage must be between 0 and 100');
      return;
    }

    // Validate dates if provided
    if (discountForm.discountStartDate && discountForm.discountEndDate) {
      const startDate = new Date(discountForm.discountStartDate);
      const endDate = new Date(discountForm.discountEndDate);
      
      if (startDate > endDate) {
        toast.error('Start date must be before end date');
        return;
      }
    }

    setIsSavingDiscount(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(createApiUrl(`/api/medicines/${editingMedicine._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          discountPercentage: discountForm.isActive ? discountValue : 0,
          discountStartDate: discountForm.discountStartDate || null,
          discountEndDate: discountForm.discountEndDate || null
        }),
      });

      if (!response.ok) {
        // If the medicine was not found, it might have been deleted
        if (response.status === 404) {
          toast.error('Medicine not found. It may have been deleted.');
          // Remove it from our local list
          setMedicines(prevMedicines => 
            prevMedicines.filter(m => m._id !== editingMedicine._id)
          );
          setDiscountModalOpen(false);
          setSelectingMedicine(false);
          return;
        }
        throw new Error('Failed to update discount');
      }

      const updatedMedicine = await response.json();
      
      // Update the medicine in the list
      setMedicines(prevMedicines => {
        // If the medicine was not previously in the discounted list, add it
        const isAlreadyInList = prevMedicines.some(m => m._id === updatedMedicine._id);
        if (!isAlreadyInList && updatedMedicine.discountPercentage > 0) {
          return [...prevMedicines, updatedMedicine];
        }
        // Otherwise, update the existing entry
        return prevMedicines.map(medicine => 
          medicine._id === editingMedicine._id ? updatedMedicine : medicine
        );
      });
      
      toast.success('Discount updated successfully!');
      setDiscountModalOpen(false);
      setSelectingMedicine(false);
      
      // Refresh the medicine list to ensure consistency
      refreshMedicines();
      
    } catch (error) {
      toast.error('Failed to save discount. Please try again.');
    } finally {
      setIsSavingDiscount(false);
    }
  };

  // Refresh the medicine list
  const refreshMedicines = async () => {
    try {
      setLoading(true);
      // Fetch up to 100 discounted medicines to ensure we get all of them
      const response = await fetch(createApiUrl('/api/medicines/discounted?limit=100'));
      if (response.ok) {
        const data = await response.json();
        // Validate that we're only getting valid medicines
        const validMedicines = Array.isArray(data.medicines) 
          ? data.medicines.filter(medicine => 
              medicine && medicine._id && medicine.name
            )
          : [];
        setMedicines(validMedicines);
      } else {
        throw new Error('Failed to fetch discounted medicines');
      }
    } catch (error) {
      toast.error('Failed to load discounted medicines');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(discountSearch.toLowerCase()) ||
                         medicine.company.toLowerCase().includes(discountSearch.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(discountSearch.toLowerCase());
    
    const hasDiscount = medicine.discountPercentage > 0;
    const matchesStatus = discountStatusFilter === 'all' || 
      (discountStatusFilter === 'active' && hasDiscount) ||
      (discountStatusFilter === 'inactive' && !hasDiscount);
    
    return matchesSearch && matchesStatus;
  });

  const displayedMedicines = showAll ? filteredMedicines : filteredMedicines.slice(0, 50);

  const getDiscountStatusColor = (medicine) => {
    if (medicine.discountPercentage > 0) {
      // Check if discount is currently active based on dates
      const currentDate = new Date();
      const startDate = medicine.discountStartDate ? new Date(medicine.discountStartDate) : null;
      const endDate = medicine.discountEndDate ? new Date(medicine.discountEndDate) : null;
      
      const isStarted = !startDate || startDate <= currentDate;
      const isEnded = endDate && endDate < currentDate;
      
      if (isStarted && !isEnded) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      } else if (!isStarted) {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      } else {
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getDiscountStatusText = (medicine) => {
    if (medicine.discountPercentage > 0) {
      // Check if discount is currently active based on dates
      const currentDate = new Date();
      const startDate = medicine.discountStartDate ? new Date(medicine.discountStartDate) : null;
      const endDate = medicine.discountEndDate ? new Date(medicine.discountEndDate) : null;
      
      const isStarted = !startDate || startDate <= currentDate;
      const isEnded = endDate && endDate < currentDate;
      
      if (isStarted && !isEnded) {
        return `${medicine.discountPercentage}% OFF`;
      } else if (!isStarted) {
        return `Scheduled ${medicine.discountPercentage}%`;
      } else {
        return `Expired ${medicine.discountPercentage}%`;
      }
    }
    return 'No Discount';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Percent className="w-6 h-6" />
            Discount Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Manage special offers and discounts for medicines
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={refreshMedicines} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => openDiscountModal()} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Discount
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search medicines..."
                value={discountSearch}
                onChange={(e) => setDiscountSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={discountStatusFilter} onValueChange={setDiscountStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Medicines</SelectItem>
                <SelectItem value="active">With Discount</SelectItem>
                <SelectItem value="inactive">No Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discount Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Discounted</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {medicines.length}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-full">
                <Tag className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Discounts</p>
                <p className="text-2xl font-bold text-green-600">
                  {medicines.filter(m => m.discountPercentage >= 25).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Discount</p>
                <p className="text-2xl font-bold text-purple-600">
                  {medicines.length > 0 
                    ? Math.round(medicines.reduce((sum, m) => sum + (m.discountPercentage || 0), 0) / medicines.length) 
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicines List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Discounted Medicines ({filteredMedicines.length})</span>
            {filteredMedicines.length > 50 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show All (${filteredMedicines.length})`}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading discounted medicines...</p>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <Percent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No discounted medicines found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {discountSearch || discountStatusFilter !== 'all'
                  ? 'Try adjusting your search and filters.'
                  : 'No discounted medicines available. Add discounts to medicines to see them here.'}
              </p>
              <Button onClick={() => refreshMedicines()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh List
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedMedicines.map((medicine) => (
                <div 
                  key={medicine._id} 
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Medicine Preview */}
                    <div className="lg:w-1/4">
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/400x200?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Medicine Details */}
                    <div className="lg:w-3/4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {medicine.name}
                            </h3>
                            <Badge className={`${getDiscountStatusColor(medicine)} flex items-center gap-1`}>
                              <Percent className="w-3 h-3" />
                              {getDiscountStatusText(medicine)}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {medicine.company} - {medicine.genericName}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Tag className="w-4 h-4" />
                              <span>{medicine.category?.name || 'Uncategorized'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <span>Price: ৳{medicine.price?.toFixed(2) || '0.00'}</span>
                            </div>
                            
                            {medicine.discountPercentage > 0 && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span>
                                  Discounted Price: ৳{(medicine.price * (1 - medicine.discountPercentage / 100)).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2 min-w-0 sm:min-w-[180px]">
                          <Button
                            onClick={() => openDiscountModal(medicine)}
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Edit Discount</span>
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

      {/* Discount Modal */}
      <Dialog open={discountModalOpen} onOpenChange={(open) => {
        setDiscountModalOpen(open);
        if (!open) {
          setSelectingMedicine(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectingMedicine ? 'Select Medicine' : editingMedicine ? 'Edit Discount' : 'Create New Discount'}
            </DialogTitle>
            <DialogDescription>
              {selectingMedicine 
                ? 'Select a medicine to add a discount' 
                : `Set discount percentage for ${editingMedicine?.name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectingMedicine ? (
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              {allMedicines.length === 0 ? (
                <p className="text-center text-gray-500">Loading medicines...</p>
              ) : (
                allMedicines.map((medicine) => (
                  <div 
                    key={medicine._id} 
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setEditingMedicine(medicine);
                      setSelectingMedicine(false);
                    }}
                  >
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{medicine.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{medicine.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{medicine.price?.toFixed(2)}</p>
                      {medicine.discountPercentage > 0 && (
                        <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {medicine.discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : editingMedicine && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={editingMedicine.image}
                    alt={editingMedicine.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x100?text=No+Image';
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{editingMedicine.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{editingMedicine.company}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price: ৳{editingMedicine.price?.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount-percentage">Discount Percentage *</Label>
                  <div className="relative">
                    <Input
                      id="discount-percentage"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={discountForm.discountPercentage}
                      onChange={(e) => setDiscountForm({...discountForm, discountPercentage: e.target.value})}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter a value between 0 and 100</p>
                </div>
                
                <div>
                  <Label htmlFor="discounted-price">Discounted Price</Label>
                  <Input
                    id="discounted-price"
                    type="text"
                    readOnly
                    value={discountForm.discountPercentage > 0 
                      ? `৳${(editingMedicine.price * (1 - discountForm.discountPercentage / 100)).toFixed(2)}` 
                      : 'No discount'}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount-start-date">Start Date</Label>
                  <div className="relative">
                    <Input
                      id="discount-start-date"
                      type="date"
                      value={discountForm.discountStartDate}
                      onChange={(e) => setDiscountForm({...discountForm, discountStartDate: e.target.value})}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="discount-end-date">End Date</Label>
                  <div className="relative">
                    <Input
                      id="discount-end-date"
                      type="date"
                      value={discountForm.discountEndDate}
                      onChange={(e) => setDiscountForm({...discountForm, discountEndDate: e.target.value})}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="discount-active"
                  checked={discountForm.isActive}
                  onChange={(e) => setDiscountForm({...discountForm, isActive: e.target.checked})}
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <Label htmlFor="discount-active">Active (apply discount)</Label>
              </div>
              
              {discountForm.discountPercentage > 0 && discountForm.isActive && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    <strong>Customer will save:</strong> ৳{(editingMedicine.price * discountForm.discountPercentage / 100).toFixed(2)} 
                    ({discountForm.discountPercentage}% off)
                  </p>
                  {discountForm.discountStartDate && (
                    <p className="text-green-800 dark:text-green-200 mt-1">
                      <strong>Starts on:</strong> {new Date(discountForm.discountStartDate).toLocaleDateString()}
                    </p>
                  )}
                  {discountForm.discountEndDate && (
                    <p className="text-green-800 dark:text-green-200 mt-1">
                      <strong>Ends on:</strong> {new Date(discountForm.discountEndDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountModalOpen(false)}>
              Cancel
            </Button>
            {!selectingMedicine && (
              <Button 
                onClick={saveDiscount} 
                disabled={isSavingDiscount || !editingMedicine}
              >
                {isSavingDiscount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Discount'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DiscountsTab;