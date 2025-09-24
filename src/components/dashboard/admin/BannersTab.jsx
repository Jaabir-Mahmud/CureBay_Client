import React, { useState } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Monitor,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
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
import toast from 'react-hot-toast';

function BannersTab({ 
  bannerAds, 
  setBannerAds 
}) {
  const [bannerSearch, setBannerSearch] = useState('');
  const [bannerStatusFilter, setBannerStatusFilter] = useState('all'); // all, active, inactive, scheduled, expired
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    priority: 3,
    isActive: true,
    startDate: '',
    endDate: ''
  });
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Banner Advertisement Functions
  const openBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title,
        description: banner.description,
        image: banner.image,
        link: banner.link,
        priority: banner.priority,
        isActive: banner.isActive,
        startDate: banner.startDate || '',
        endDate: banner.endDate || ''
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        description: '',
        image: '',
        link: '',
        priority: 3,
        isActive: true,
        startDate: '',
        endDate: ''
      });
    }
    setBannerModalOpen(true);
  };

  const saveBanner = async () => {
    if (!bannerForm.title.trim() || !bannerForm.image.trim()) {
      toast.error('Title and image are required.');
      return;
    }
    
    setIsSavingBanner(true);
    try {
      if (editingBanner) {
        // Update existing banner
        const response = await fetch(`/api/banners/${editingBanner._id || editingBanner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerForm),
        });

        if (!response.ok) {
          throw new Error('Failed to update banner');
        }

        const updatedBanner = await response.json();
        // Convert _id to id for frontend compatibility
        const bannerWithId = {
          ...updatedBanner,
          id: updatedBanner._id
        };

        setBannerAds(prevBanners => 
          prevBanners.map(banner => 
            (banner._id === editingBanner._id || banner.id === editingBanner.id) 
              ? bannerWithId
              : banner
          )
        );
        toast.success('Banner updated successfully!');
      } else {
        // Create new banner
        const response = await fetch('/api/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerForm),
        });

        if (!response.ok) {
          throw new Error('Failed to create banner');
        }

        const newBanner = await response.json();
        // Convert _id to id for frontend compatibility
        const bannerWithId = {
          ...newBanner,
          id: newBanner._id
        };

        setBannerAds(prevBanners => [...prevBanners, bannerWithId]);
        toast.success('Banner created successfully!');
      }
      
      setBannerModalOpen(false);
      
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner. Please try again.');
    } finally {
      setIsSavingBanner(false);
    }
  };

  const deleteBanner = async (bannerId) => {
    // Check if bannerId is valid
    if (!bannerId) {
      toast.error('Invalid banner ID');
      return;
    }
    
    const banner = bannerAds.find(b => b._id === bannerId || b.id === bannerId);
    if (window.confirm(`Are you sure you want to delete "${banner?.title}"?`)) {
      try {
        const response = await fetch(`/api/banners/${bannerId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete banner');
        }

        setBannerAds(prevBanners => prevBanners.filter(b => b._id !== bannerId && b.id !== bannerId));
        toast.success('Banner deleted successfully!');
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast.error('Failed to delete banner. Please try again.');
      }
    }
  };

  const toggleBannerStatus = async (bannerId) => {
    // Check if bannerId is valid
    if (!bannerId) {
      toast.error('Invalid banner ID');
      return;
    }
    
    try {
      const response = await fetch(`/api/banners/${bannerId}/toggle-status`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle banner status');
      }

      const updatedBanner = await response.json();
      // Convert _id to id for frontend compatibility
      const bannerWithId = {
        ...updatedBanner,
        id: updatedBanner._id
      };

      setBannerAds(prevBanners => 
        prevBanners.map(banner => 
          (banner._id === bannerId || banner.id === bannerId) 
            ? bannerWithId
            : banner
        )
      );
      
      toast.success(`Banner ${updatedBanner.isActive ? 'activated' : 'deactivated'} successfully!`);
      
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status.');
    }
  };

  const changeBannerPriority = async (bannerId, newPriority) => {
    // Check if bannerId is valid
    if (!bannerId) {
      toast.error('Invalid banner ID');
      return;
    }
    
    try {
      const response = await fetch(`/api/banners/${bannerId}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });

      if (!response.ok) {
        throw new Error('Failed to update banner priority');
      }

      const updatedBanner = await response.json();
      // Convert _id to id for frontend compatibility
      const bannerWithId = {
        ...updatedBanner,
        id: updatedBanner._id
      };

      setBannerAds(prevBanners => 
        prevBanners.map(banner => 
          (banner._id === bannerId || banner.id === bannerId) 
            ? bannerWithId
            : banner
        )
      );
      
      toast.success('Banner priority updated successfully!');
      
    } catch (error) {
      console.error('Error updating banner priority:', error);
      toast.error('Failed to update banner priority.');
    }
  };

  const filteredBannerAds = bannerAds.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(bannerSearch.toLowerCase()) ||
                         banner.description.toLowerCase().includes(bannerSearch.toLowerCase());
    
    const matchesStatus = bannerStatusFilter === 'all' || 
      (bannerStatusFilter === 'active' && banner.isActive && isBannerActive(banner)) ||
      (bannerStatusFilter === 'inactive' && !banner.isActive) ||
      (bannerStatusFilter === 'scheduled' && banner.isActive && isBannerScheduled(banner)) ||
      (bannerStatusFilter === 'expired' && banner.isActive && isBannerExpired(banner));
    
    return matchesSearch && matchesStatus;
}).sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const isBannerActive = (banner) => {
  const now = new Date();
  const start = banner.startDate ? new Date(banner.startDate) : null;
  const end = banner.endDate ? new Date(banner.endDate) : null;
  
  return banner.isActive && 
         (!start || now >= start) && 
         (!end || now <= end);
};

const isBannerScheduled = (banner) => {
  const now = new Date();
  const start = banner.startDate ? new Date(banner.startDate) : null;
  
  return banner.isActive && start && now < start;
};

const isBannerExpired = (banner) => {
  const now = new Date();
  const end = banner.endDate ? new Date(banner.endDate) : null;
  
  return banner.isActive && end && now > end;
};

const getBannerStatusColor = (banner) => {
  if (!banner.isActive) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  if (isBannerScheduled(banner)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
  if (isBannerExpired(banner)) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
};

const getBannerStatusIcon = (banner) => {
  if (!banner.isActive) return <XCircle className="w-4 h-4" />;
  if (isBannerScheduled(banner)) return <Clock className="w-4 h-4" />;
  if (isBannerExpired(banner)) return <AlertCircle className="w-4 h-4" />;
  return <CheckCircle className="w-4 h-4" />;
};

const getBannerStatusText = (banner) => {
  if (!banner.isActive) return 'Inactive';
  if (isBannerScheduled(banner)) return 'Scheduled';
  if (isBannerExpired(banner)) return 'Expired';
  return 'Active';
};

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6" />
            Banner Advertisement Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Manage homepage banner advertisements and promotions
          </p>
        </div>
        
        <Button onClick={() => openBannerModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search banners..."
                value={bannerSearch}
                onChange={(e) => setBannerSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={bannerStatusFilter} onValueChange={setBannerStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Banner Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Banners</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {bannerAds.length}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-full">
                <Megaphone className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Banners</p>
                <p className="text-2xl font-bold text-green-600">
                  {bannerAds.filter(b => b.isActive && isBannerActive(b)).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bannerAds.reduce((sum, banner) => sum + (banner.views || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-orange-600">
                  {bannerAds.reduce((sum, banner) => sum + (banner.clicks || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Monitor className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banners List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Banner Advertisements ({filteredBannerAds.length})</span>
            <Badge variant="secondary" className="text-sm">
              Sorted by Priority
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredBannerAds.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No banners found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {bannerSearch || bannerStatusFilter !== 'all'
                  ? 'Try adjusting your search and filters.'
                  : 'Create your first banner advertisement to get started.'}
              </p>
              {!bannerSearch && bannerStatusFilter === 'all' && (
                <Button onClick={() => openBannerModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Banner
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBannerAds.map((banner) => (
                <div 
                  key={banner.id || banner._id} 
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Banner Preview */}
                    <div className="lg:w-1/4">
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={banner.image}
                          alt={banner.title}
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
                    
                    {/* Banner Details */}
                    <div className="lg:w-3/4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {banner.title}
                            </h3>
                            <Badge className={`${getBannerStatusColor(banner)} flex items-center gap-1`}>
                              {getBannerStatusIcon(banner)}
                              {getBannerStatusText(banner)}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Priority: {banner.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {banner.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Monitor className="w-4 h-4" />
                              <span className="truncate">{banner.link || 'No link'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Eye className="w-4 h-4" />
                              <span>Views: {banner.views?.toLocaleString() || 0}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Monitor className="w-4 h-4" />
                              <span>Clicks: {banner.clicks?.toLocaleString() || 0}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <TrendingUp className="w-4 h-4" />
                              <span>
                                CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(2) : 0}%
                              </span>
                            </div>
                          </div>
                          
                          {(banner.startDate || banner.endDate) && (
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
                              {banner.startDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Start: {formatDate(banner.startDate)}</span>
                                </div>
                              )}
                              {banner.endDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>End: {formatDate(banner.endDate)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2 min-w-0 sm:min-w-[180px]">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => openBannerModal(banner)}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              onClick={() => deleteBanner(banner.id || banner._id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            onClick={() => toggleBannerStatus(banner.id || banner._id)}
                            size="sm"
                            className={`w-full ${
                              banner.isActive 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {banner.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            <Label className="text-xs whitespace-nowrap">Priority:</Label>
                            <Select 
                              value={banner.priority.toString()} 
                              onValueChange={(value) => changeBannerPriority(banner.id || banner._id, parseInt(value))}
                            >
                              <SelectTrigger className="h-8 text-xs flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 (Lowest)</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5 (Highest)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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

      {/* Banner Modal */}
      <Dialog open={bannerModalOpen} onOpenChange={setBannerModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner Advertisement' : 'Create New Banner Advertisement'}
            </DialogTitle>
            <DialogDescription>
              Configure your banner advertisement for the homepage slider
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner-title">Title *</Label>
                <Input
                  id="banner-title"
                  placeholder="Summer Health Sale"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="banner-priority">Priority</Label>
                <Select 
                  value={bannerForm.priority.toString()} 
                  onValueChange={(value) => setBannerForm({...bannerForm, priority: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Lowest)</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3 (Default)</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5 (Highest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="banner-description">Description</Label>
              <Textarea
                id="banner-description"
                placeholder="Save up to 30% on vitamins and supplements..."
                value={bannerForm.description}
                onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="banner-image">Image URL *</Label>
              <Input
                id="banner-image"
                placeholder="https://images.unsplash.com/photo-..."
                value={bannerForm.image}
                onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="banner-link">Link URL</Label>
              <Input
                id="banner-link"
                placeholder="/category/supplements"
                value={bannerForm.link}
                onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner-start-date">Start Date (Optional)</Label>
                <Input
                  id="banner-start-date"
                  type="date"
                  value={bannerForm.startDate}
                  onChange={(e) => setBannerForm({...bannerForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="banner-end-date">End Date (Optional)</Label>
                <Input
                  id="banner-end-date"
                  type="date"
                  value={bannerForm.endDate}
                  onChange={(e) => setBannerForm({...bannerForm, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="banner-active"
                checked={bannerForm.isActive}
                onChange={(e) => setBannerForm({...bannerForm, isActive: e.target.checked})}
                className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <Label htmlFor="banner-active">Active (show on homepage)</Label>
            </div>
            
            {/* Preview */}
            {bannerForm.image && (
              <div>
                <Label>Preview</Label>
                <div className="mt-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <img
                    src={bannerForm.image}
                    alt="Banner preview"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <h4 className="font-medium">{bannerForm.title || 'Banner Title'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {bannerForm.description || 'Banner description will appear here'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveBanner} 
              disabled={isSavingBanner || !bannerForm.title.trim() || !bannerForm.image.trim()}
            >
              {isSavingBanner ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                editingBanner ? 'Update Banner' : 'Create Banner'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BannersTab;