import React, { useState, useEffect } from 'react';
import { Search, Package, Eye, Edit, Trash2, Check, X, Pill, ShoppingCart, Tag, Monitor, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
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
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../lib/i18n';

function MedicineSlidesManager({ bannerAds, heroSlides, setBannerAds, setHeroSlides }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [medicines, setMedicines] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editMedicineModalOpen, setEditMedicineModalOpen] = useState(false);
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
  const [newMedicineForm, setNewMedicineForm] = useState({
    name: '',
    genericName: '',
    description: '',
    image: '',
    category: '',
    company: '',
    massUnit: 'mg',
    price: '',
    unitPrice: '',
    stripPrice: '',
    discountPercentage: '0',
    stockQuantity: '100',
    seller: ''
  });
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all medicines
  useEffect(() => {
    fetchMedicines();
    fetchSellers();
    fetchCategories(); // Fetch categories when component mounts
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch('/api/medicines?limit=1000', { headers });
      if (response.ok) {
        const data = await response.json();
        // Deduplicate medicines by their id/_id to avoid duplicate React keys and duplicate render entries
        const raw = data.medicines || [];
        const seen = new Set();
        const unique = [];
        raw.forEach((m) => {
          const id = m._id || m.id;
          if (!id) {
            // If no id available, push as-is (will fallback to index key later)
            unique.push(m);
            return;
          }
          if (!seen.has(id)) {
            seen.add(id);
            unique.push(m);
          } else {
            // Log duplicate occurrence for easier debugging
            // eslint-disable-next-line no-console
            console.warn('Duplicate medicine skipped when setting state:', id);
          }
        });
        setMedicines(unique);
      } else {
        throw new Error('Failed to fetch medicines');
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error(t('admin.medicines.fetchError', language));
    } finally {
      setLoading(false);
    }
  };

  // Fetch sellers
  const fetchSellers = async () => {
    try {
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch('/api/users?role=seller', { headers });
      if (response.ok) {
        const data = await response.json();
        setSellers(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch('/api/categories', { headers });
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Check if a medicine is used in any banner
  const isMedicineInBanners = (medicineId) => {
    return bannerAds.some(banner => 
      banner.link && banner.link.includes(medicineId)
    );
  };

  // Check if a medicine is used in any hero slide
  const isMedicineInHeroSlides = (medicineId) => {
    return heroSlides.some(slide => 
      slide.buttonLink && slide.buttonLink.includes(medicineId)
    );
  };

  // Open preview modal
  const openPreview = (medicine) => {
    setSelectedMedicine(medicine);
    setPreviewModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (medicine) => {
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

  // Close edit modal
  const closeEditModal = () => {
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

  // Close add modal
  const closeAddModal = () => {
    setAddMedicineModalOpen(false);
    setNewMedicineForm({
      name: '',
      genericName: '',
      description: '',
      image: '',
      category: '',
      company: '',
      massUnit: 'mg',
      price: '',
      unitPrice: '',
      stripPrice: '',
      discountPercentage: '0',
      stockQuantity: '100',
      seller: ''
    });
  };

  // Handle update medicine
  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!medicineForm.name.trim()) {
      toast.error(t('admin.medicines.nameRequired', language));
      return;
    }
    if (!medicineForm.genericName.trim()) {
      toast.error(t('admin.medicines.genericNameRequired', language));
      return;
    }
    if (!medicineForm.description.trim()) {
      toast.error(t('admin.medicines.descriptionRequired', language));
      return;
    }
    if (!medicineForm.category) {
      toast.error(t('admin.medicines.categoryRequired', language));
      return;
    }
    if (!medicineForm.company.trim()) {
      toast.error(t('admin.medicines.companyRequired', language));
      return;
    }
    if (!medicineForm.massUnit.trim()) {
      toast.error(t('admin.medicines.massUnitRequired', language));
      return;
    }
    if (!medicineForm.price || isNaN(medicineForm.price) || parseFloat(medicineForm.price) <= 0) {
      toast.error(t('admin.medicines.priceRequired', language));
      return;
    }
    if (!medicineForm.stockQuantity || isNaN(medicineForm.stockQuantity) || parseInt(medicineForm.stockQuantity) < 0) {
      toast.error(t('admin.medicines.stockRequired', language));
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
        discountPercentage: parseFloat(medicineForm.discountPercentage) || 0,
        stockQuantity: parseInt(medicineForm.stockQuantity) || 0,
      };

      const res = await fetch(`/api/medicines/${editingMedicine._id || editingMedicine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const responseText = await res.text();

      if (res.ok) {
        const updatedMedicine = JSON.parse(responseText);
        console.log('Medicine updated successfully:', updatedMedicine);
        
        // Update the medicine in the state
        setMedicines(prevMedicines => {
          return prevMedicines.map(medicine => 
            (medicine._id === editingMedicine._id || medicine.id === editingMedicine.id) 
              ? updatedMedicine 
              : medicine
          );
        });
        
        toast.success(t('admin.medicines.updated', language));
        closeEditModal();
      } else {
        let errorMessage = t('admin.medicines.updateFailed', language);
        try {
          const errorData = JSON.parse(responseText);
          console.error('Server error response:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use the raw text or status text
          console.error('Non-JSON error response:', responseText);
          errorMessage = responseText || res.statusText || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast.error(t('admin.medicines.updateError', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newMedicineForm.name.trim()) {
      toast.error(t('admin.medicines.nameRequired', language));
      return;
    }
    if (!newMedicineForm.genericName.trim()) {
      toast.error(t('admin.medicines.genericNameRequired', language));
      return;
    }
    if (!newMedicineForm.description.trim()) {
      toast.error(t('admin.medicines.descriptionRequired', language));
      return;
    }
    if (!newMedicineForm.category) {
      toast.error(t('admin.medicines.categoryRequired', language));
      return;
    }
    if (!newMedicineForm.company.trim()) {
      toast.error(t('admin.medicines.companyRequired', language));
      return;
    }
    if (!newMedicineForm.massUnit.trim()) {
      toast.error(t('admin.medicines.massUnitRequired', language));
      return;
    }
    if (!newMedicineForm.price || isNaN(newMedicineForm.price) || parseFloat(newMedicineForm.price) <= 0) {
      toast.error(t('admin.medicines.priceRequired', language));
      return;
    }
    if (!newMedicineForm.stockQuantity || isNaN(newMedicineForm.stockQuantity) || parseInt(newMedicineForm.stockQuantity) < 0) {
      toast.error(t('admin.medicines.stockRequired', language));
      return;
    }
    if (user?.role === 'admin' && !newMedicineForm.seller) {
      toast.error('Please select a seller for this medicine');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const formData = {
        ...newMedicineForm,
        price: parseFloat(newMedicineForm.price),
        unitPrice: parseFloat(newMedicineForm.unitPrice) || 0,
        stripPrice: parseFloat(newMedicineForm.stripPrice) || 0,
        discountPercentage: parseFloat(newMedicineForm.discountPercentage) || 0,
        stockQuantity: parseInt(newMedicineForm.stockQuantity) || 0,
      };

      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const responseText = await res.text();

      if (res.ok) {
        const newMedicine = JSON.parse(responseText);
        console.log('Medicine created successfully:', newMedicine);
        
        // Add the new medicine to the state
        setMedicines(prevMedicines => [...prevMedicines, newMedicine]);
        
        toast.success(t('admin.medicines.created', language));
        closeAddModal();
        fetchMedicines(); // Refresh the medicine list
      } else {
        let errorMessage = t('admin.medicines.createFailed', language);
        try {
          const errorData = JSON.parse(responseText);
          console.error('Server error response:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use the raw text or status text
          console.error('Non-JSON error response:', responseText);
          errorMessage = responseText || res.statusText || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating medicine:', error);
      toast.error(t('admin.medicines.createError', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete medicine
  const deleteMedicine = async (medicineId) => {
    if (!window.confirm(t('admin.medicines.deleteConfirm', language))) {
      return;
    }
    
    try {
      // Get the ID token for authentication
      const token = user ? await user.getIdToken() : null;
      const headers = {};
      
      // Add Authorization header if token is available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/medicines/${medicineId}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        // Remove the medicine from the state
        setMedicines(prevMedicines => 
          prevMedicines.filter(medicine => 
            medicine._id !== medicineId && medicine.id !== medicineId
          )
        );
        toast.success(t('admin.medicines.deleted', language));
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || t('admin.medicines.deleteError', language));
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast.error(t('admin.medicines.deleteError', language));
    }
  };

  // Toggle medicine status
  const toggleMedicineStatus = async (medicineId, currentStatus) => {
    try {
      // Get the ID token for authentication
      const token = user ? await user.getIdToken() : null;
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token is available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/medicines/${medicineId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ inStock: !currentStatus }),
      });

      if (res.ok) {
        const updatedMedicine = await res.json();
        // Update the medicine in the state
        setMedicines(prevMedicines => {
          return prevMedicines.map(medicine => 
            (medicine._id === medicineId || medicine.id === medicineId) 
              ? updatedMedicine 
              : medicine
          );
        });
        toast.success(`Medicine ${!currentStatus ? t('admin.heroSlides.activate', language) : t('admin.heroSlides.deactivate', language)} successfully!`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || t('admin.medicines.deleteError', language));
      }
    } catch (error) {
      console.error('Error updating medicine status:', error);
      toast.error(t('admin.medicines.deleteError', language));
    }
  };

  // Filter medicines based on search
  const filteredMedicines = medicines.filter(medicine => {
    const searchLower = search.toLowerCase();
    return (
      medicine.name.toLowerCase().includes(searchLower) ||
      medicine.genericName.toLowerCase().includes(searchLower) ||
      medicine.company.toLowerCase().includes(searchLower)
    );
  });

  // Show only first 20 medicines when no search is applied
  const displayMedicines = search ? filteredMedicines : filteredMedicines.slice(0, 20);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6" />
            Medicine Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Manage medicines and their usage in banners and hero slides
          </p>
        </div>
        <Button onClick={() => setAddMedicineModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Medicine
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('admin.medicines.searchPlaceholder', language)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Display count information */}
      {!search && medicines.length > 20 && (
        <div className="text-sm text-gray-500">
          {t('admin.medicines.showingFirst20', language).replace('{total}', medicines.length)}
        </div>
      )}

      {/* Medicines Grid - Enhanced UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayMedicines.map((medicine, idx) => {
          const inBanners = isMedicineInBanners(medicine._id);
          const inHeroSlides = isMedicineInHeroSlides(medicine._id);
          // Construct a stable key: prefer _id or id, otherwise use name+index or index
          const keyId = medicine._id || medicine.id || (medicine.name ? `${medicine.name}-${idx}` : `med-${idx}`);

          return (
            <Card key={keyId} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img 
                      src={medicine.image} 
                      alt={medicine.name} 
                      className="h-16 w-16 object-cover rounded-md flex-shrink-0 border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                    />
                    {medicine.discountPercentage > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {medicine.discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{medicine.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{medicine.genericName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                        ৳{medicine.price}
                      </span>
                      {medicine.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through">
                          ৳{((medicine.price * 100) / (100 - medicine.discountPercentage)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {inBanners && (
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs px-1 py-0">
                          <Tag className="w-3 h-3 mr-1" />
                          Banner
                        </Badge>
                      )}
                      {inHeroSlides && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs px-1 py-0">
                          <Monitor className="w-3 h-3 mr-1" />
                          Hero
                        </Badge>
                      )}
                      {medicine.isAdvertised && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Ad
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    {medicine.inStock ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <X className="w-3 h-3 mr-1" />
                        Out
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPreview(medicine)}
                      className="px-2 py-1 h-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(medicine)}
                      className="px-2 py-1 h-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMedicine(medicine._id)}
                      className="px-2 py-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {displayMedicines.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="text-center py-12">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {search 
                ? t('admin.medicines.noSearchResults', language) 
                : t('admin.medicines.noMedicines', language)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search 
                ? 'Try adjusting your search terms.' 
                : 'No medicines found in the system.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Medicine Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              {selectedMedicine?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedMedicine?.genericName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMedicine && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="relative">
                  <img 
                    src={selectedMedicine.image} 
                    alt={selectedMedicine.name} 
                    className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                  />
                  {selectedMedicine.discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      {selectedMedicine.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.medicines.company', language)}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedMedicine.company}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.medicines.description', language)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedMedicine.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.medicines.price', language)}</h3>
                    <p className="text-cyan-600 dark:text-cyan-400 font-medium">
                      ৳{selectedMedicine.price} 
                      {selectedMedicine.discountPercentage > 0 && (
                        <span className="ml-2 text-sm text-red-600 line-through">
                          ৳{((selectedMedicine.price * 100) / (100 - selectedMedicine.discountPercentage)).toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Stock</h3>
                    <p className={selectedMedicine.inStock ? "text-green-600" : "text-red-600"}>
                      {selectedMedicine.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant={isMedicineInBanners(selectedMedicine._id) ? "default" : "secondary"} className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {isMedicineInBanners(selectedMedicine._id) 
                      ? t('admin.medicines.inBanner', language) 
                      : t('admin.medicines.notInBanner', language)}
                  </Badge>
                  <Badge variant={isMedicineInHeroSlides(selectedMedicine._id) ? "default" : "secondary"} className="flex items-center gap-1">
                    <Monitor className="w-4 h-4" />
                    {isMedicineInHeroSlides(selectedMedicine._id) 
                      ? t('admin.medicines.inHero', language) 
                      : t('admin.medicines.notInHero', language)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setPreviewModalOpen(false)}>
              {t('close', language)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Modal */}
      <Dialog open={editMedicineModalOpen} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {t('admin.medicines.editTitle', language)}
            </DialogTitle>
            <DialogDescription>
              {t('admin.medicines.editDescription', language)}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateMedicine} className="space-y-4">
            {/* Medicine Name */}
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                {t('admin.medicines.medicineName', language)} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                type="text"
                value={medicineForm.name}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('admin.medicines.enterMedicineName', language)}
                required
                className="mt-1"
              />
            </div>

            {/* Generic Name */}
            <div>
              <Label htmlFor="edit-genericName" className="text-sm font-medium">
                {t('admin.medicines.genericName', language)}
              </Label>
              <Input
                id="edit-genericName"
                type="text"
                value={medicineForm.genericName}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, genericName: e.target.value }))}
                placeholder={t('admin.medicines.enterGenericName', language)}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                {t('admin.medicines.briefDescription', language)}
              </Label>
              <Textarea
                id="edit-description"
                value={medicineForm.description}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('admin.medicines.enterDescription', language)}
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium">
                {t('admin.medicines.category', language)} <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={medicineForm.category} 
                onValueChange={(value) => setMedicineForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="edit-company" className="text-sm font-medium">
                {t('admin.medicines.company', language)}
              </Label>
              <Input
                id="edit-company"
                type="text"
                value={medicineForm.company}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder={t('admin.medicines.enterCompanyName', language)}
                className="mt-1"
              />
            </div>

            {/* Mass Unit */}
            <div>
              <Label htmlFor="edit-massUnit" className="text-sm font-medium">
                {t('admin.medicines.massUnit', language)}
              </Label>
              <Input
                id="edit-massUnit"
                type="text"
                value={medicineForm.massUnit}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, massUnit: e.target.value }))}
                placeholder={t('admin.medicines.exampleMassUnit', language)}
                className="mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="edit-price" className="text-sm font-medium">
                {t('admin.medicines.priceTaka', language)} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={medicineForm.price}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder={t('admin.medicines.enterPrice', language)}
                required
                className="mt-1"
              />
            </div>

            {/* Unit Price */}
            <div>
              <Label htmlFor="edit-unitPrice" className="text-sm font-medium">
                {t('admin.medicines.unitPrice', language)}
              </Label>
              <Input
                id="edit-unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={medicineForm.unitPrice}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                placeholder={t('admin.medicines.enterUnitPrice', language)}
                className="mt-1"
              />
            </div>

            {/* Strip Price */}
            <div>
              <Label htmlFor="edit-stripPrice" className="text-sm font-medium">
                {t('admin.medicines.stripPrice', language)}
              </Label>
              <Input
                id="edit-stripPrice"
                type="number"
                step="0.01"
                min="0"
                value={medicineForm.stripPrice}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, stripPrice: e.target.value }))}
                placeholder={t('admin.medicines.enterStripPrice', language)}
                className="mt-1"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <Label htmlFor="edit-discountPercentage" className="text-sm font-medium">
                {t('admin.medicines.discountPercentage', language)}
              </Label>
              <Input
                id="edit-discountPercentage"
                type="number"
                min="0"
                max="100"
                value={medicineForm.discountPercentage}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                placeholder={t('admin.medicines.enterDiscountPercentage', language)}
                className="mt-1"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <Label htmlFor="edit-stockQuantity" className="text-sm font-medium">
                {t('admin.medicines.stockQuantity', language)} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-stockQuantity"
                type="number"
                min="0"
                value={medicineForm.stockQuantity}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                placeholder={t('admin.medicines.enterQuantity', language)}
                required
                className="mt-1"
              />
            </div>

            {/* Medicine Image */}
            <div>
              <Label htmlFor="edit-image" className="text-sm font-medium">
                {t('admin.medicines.medicineImage', language)}
              </Label>
              <Input
                id="edit-image"
                type="url"
                value={medicineForm.image}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, image: e.target.value }))}
                placeholder={t('admin.medicines.imagePlaceholder', language)}
                className="mt-1"
              />
              {medicineForm.image && (
                <div className="mt-2">
                  <img 
                    src={medicineForm.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
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
                {t('admin.medicines.advertisedMedicine', language)}
              </Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditModal}
              >
                {t('common.cancel', language)}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('admin.medicines.updating', language)}
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    {t('admin.medicines.updateMedicine', language)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Medicine Modal */}
      <Dialog open={addMedicineModalOpen} onOpenChange={closeAddModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Medicine
            </DialogTitle>
            <DialogDescription>
              Create a new medicine entry
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddMedicine} className="space-y-4">
            {/* Medicine Name */}
            <div>
              <Label htmlFor="add-name" className="text-sm font-medium">
                Medicine Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-name"
                type="text"
                value={newMedicineForm.name}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter medicine name"
                required
                className="mt-1"
              />
            </div>

            {/* Generic Name */}
            <div>
              <Label htmlFor="add-genericName" className="text-sm font-medium">
                Generic Name
              </Label>
              <Input
                id="add-genericName"
                type="text"
                value={newMedicineForm.genericName}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, genericName: e.target.value }))}
                placeholder="Enter generic name"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="add-description" className="text-sm font-medium">
                Brief Description
              </Label>
              <Textarea
                id="add-description"
                value={newMedicineForm.description}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter medicine description"
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="add-category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={newMedicineForm.category} 
                onValueChange={(value) => setNewMedicineForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="add-company" className="text-sm font-medium">
                Company
              </Label>
              <Input
                id="add-company"
                type="text"
                value={newMedicineForm.company}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>

            {/* Mass Unit */}
            <div>
              <Label htmlFor="add-massUnit" className="text-sm font-medium">
                Mass Unit
              </Label>
              <Input
                id="add-massUnit"
                type="text"
                value={newMedicineForm.massUnit}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, massUnit: e.target.value }))}
                placeholder="e.g., 500mg, 100ml"
                className="mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="add-price" className="text-sm font-medium">
                Price (৳) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-price"
                type="number"
                step="0.01"
                min="0"
                value={newMedicineForm.price}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter price"
                required
                className="mt-1"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <Label htmlFor="add-discountPercentage" className="text-sm font-medium">
                Discount Percentage
              </Label>
              <Input
                id="add-discountPercentage"
                type="number"
                min="0"
                max="100"
                value={newMedicineForm.discountPercentage}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                placeholder="Enter discount percentage"
                className="mt-1"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <Label htmlFor="add-stockQuantity" className="text-sm font-medium">
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-stockQuantity"
                type="number"
                min="0"
                value={newMedicineForm.stockQuantity}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                placeholder="Enter quantity"
                required
                className="mt-1"
              />
            </div>

            {/* Seller Selection (Admin only) */}
            {user?.role === 'admin' && (
              <div>
                <Label htmlFor="add-seller" className="text-sm font-medium">
                  Assign to Seller <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={newMedicineForm.seller} 
                  onValueChange={(value) => setNewMedicineForm(prev => ({ ...prev, seller: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a seller" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller._id} value={seller._id}>
                        {seller.name} ({seller.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Medicine Image */}
            <div>
              <Label htmlFor="add-image" className="text-sm font-medium">
                Medicine Image URL
              </Label>
              <Input
                id="add-image"
                type="url"
                value={newMedicineForm.image}
                onChange={(e) => setNewMedicineForm(prev => ({ ...prev, image: e.target.value }))}
                placeholder="Enter image URL"
                className="mt-1"
              />
              {newMedicineForm.image && (
                <div className="mt-2">
                  <img 
                    src={newMedicineForm.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeAddModal}
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
                    Creating...
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
}

export default MedicineSlidesManager;