import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  TrendingUp
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

function HeroSlidesTab({ 
  heroSlides, 
  setHeroSlides 
}) {
  const { user } = useAuth();
  const [heroSlideForm, setHeroSlideForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    backgroundColor: 'from-cyan-600 to-cyan-800',
    textColor: 'text-white',
    lightBackground: 'from-cyan-50 to-cyan-100',
    lightTextColor: 'text-gray-800',
    priority: 1,
    isActive: true,
    startDate: '',
    endDate: ''
  });
  const [heroSlideModalOpen, setHeroSlideModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState(null);

  // Hero Slides Management Functions
  const openHeroSlideModal = (slide = null) => {
    if (slide) {
      setEditingHeroSlide(slide);
      setHeroSlideForm({
        title: slide.title,
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        image: slide.image,
        buttonText: slide.buttonText || 'Shop Now',
        buttonLink: slide.buttonLink || '/shop',
        backgroundColor: slide.backgroundColor || 'from-cyan-600 to-cyan-800',
        textColor: slide.textColor || 'text-white',
        lightBackground: slide.lightBackground || 'from-cyan-50 to-cyan-100',
        lightTextColor: slide.lightTextColor || 'text-gray-800',
        priority: slide.priority || 1,
        isActive: slide.isActive !== undefined ? slide.isActive : true,
        startDate: slide.startDate || '',
        endDate: slide.endDate || ''
      });
    } else {
      setEditingHeroSlide(null);
      setHeroSlideForm({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        backgroundColor: 'from-cyan-600 to-cyan-800',
        textColor: 'text-white',
        lightBackground: 'from-cyan-50 to-cyan-100',
        lightTextColor: 'text-gray-800',
        priority: 1,
        isActive: true,
        startDate: '',
        endDate: ''
      });
    }
    setHeroSlideModalOpen(true);
  };

  const saveHeroSlide = async () => {
    try {
      // Validate required fields
      if (!heroSlideForm.title || !heroSlideForm.image || !user) {
        toast.error('Title and image are required');
        return;
      }

      const token = await user.getIdToken();
      if (editingHeroSlide) {
        // Update existing slide
        const response = await fetch(`/api/hero-slides/${editingHeroSlide._id || editingHeroSlide.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(heroSlideForm),
        });

        if (!response.ok) {
          throw new Error('Failed to update hero slide');
        }

        const updatedSlide = await response.json();
        // Convert _id to id for frontend compatibility
        const slideWithId = {
          ...updatedSlide,
          id: updatedSlide._id
        };

        // Update state
        const updatedSlides = heroSlides.map(slide => 
          (slide._id === editingHeroSlide._id || slide.id === editingHeroSlide.id) 
            ? slideWithId
            : slide
        );
        setHeroSlides(updatedSlides);
        toast.success('Hero slide updated successfully!');
      } else {
        // Add new slide
        const response = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(heroSlideForm),
        });

        if (!response.ok) {
          throw new Error('Failed to create hero slide');
        }

        const newSlide = await response.json();
        // Convert _id to id for frontend compatibility
        const slideWithId = {
          ...newSlide,
          id: newSlide._id
        };

        setHeroSlides([...heroSlides, slideWithId]);
        toast.success('Hero slide added successfully!');
      }
      setHeroSlideModalOpen(false);
    } catch (error) {
      console.error('Error saving hero slide:', error);
      toast.error(`Failed to save hero slide: ${error.message}`);
    }
  };

  const deleteHeroSlide = async (slideId) => {
    if (!user) return;
    
    const slide = heroSlides.find(s => s._id === slideId || s.id === slideId);
    if (window.confirm(`Are you sure you want to delete "${slide?.title}"?`)) {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/hero-slides/${slideId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete hero slide');
        }

        setHeroSlides(heroSlides.filter(s => s._id !== slideId && s.id !== slideId));
        toast.success('Hero slide deleted successfully!');
      } catch (error) {
        console.error('Error deleting hero slide:', error);
        toast.error(`Failed to delete hero slide: ${error.message}`);
      }
    }
  };

  const toggleHeroSlideStatus = async (slideId) => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/hero-slides/${slideId}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle hero slide status');
      }

      const updatedSlide = await response.json();
      // Convert _id to id for frontend compatibility
      const slideWithId = {
        ...updatedSlide,
        id: updatedSlide._id
      };

      setHeroSlides(heroSlides.map(slide => 
        (slide._id === slideId || slide.id === slideId) 
          ? slideWithId
          : slide
      ));
      
      toast.success(`Hero slide ${updatedSlide.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling hero slide status:', error);
      toast.error(`Failed to toggle hero slide status: ${error.message}`);
    }
  };

  const isSlideActive = (slide) => {
    const now = new Date();
    const start = slide.startDate ? new Date(slide.startDate) : null;
    const end = slide.endDate ? new Date(slide.endDate) : null;
    
    return slide.isActive && 
           (!start || now >= start) && 
           (!end || now <= end);
  };

  const isSlideScheduled = (slide) => {
    const now = new Date();
    const start = slide.startDate ? new Date(slide.startDate) : null;
    
    return slide.isActive && start && now < start;
  };

  const isSlideExpired = (slide) => {
    const now = new Date();
    const end = slide.endDate ? new Date(slide.endDate) : null;
    
    return slide.isActive && end && now > end;
  };

  const getSlideStatusColor = (slide) => {
    if (!slide.isActive) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    if (isSlideScheduled(slide)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    if (isSlideExpired(slide)) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getSlideStatusIcon = (slide) => {
    if (!slide.isActive) return <XCircle className="w-4 h-4" />;
    if (isSlideScheduled(slide)) return <Clock className="w-4 h-4" />;
    if (isSlideExpired(slide)) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getSlideStatusText = (slide) => {
    if (!slide.isActive) return 'Inactive';
    if (isSlideScheduled(slide)) return 'Scheduled';
    if (isSlideExpired(slide)) return 'Expired';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Manage Hero Slides
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Control homepage hero slider content
              </p>
            </div>
            <Button onClick={() => openHeroSlideModal()} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Hero Slide
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Hero Slides List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Hero Slides ({heroSlides.length})</span>
            <Badge variant="secondary" className="text-sm">
              Sorted by Priority
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {heroSlides.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-300">No hero slides found</p>
              <Button onClick={() => openHeroSlideModal()} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Slide
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {heroSlides
                .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                .map((slide) => (
                  <div 
                    key={slide._id || slide.id} 
                    className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Slide Preview */}
                      <div className="lg:w-1/4">
                        <div 
                          className={`relative h-32 rounded-lg bg-gradient-to-r ${slide.backgroundColor} overflow-hidden border border-gray-200 dark:border-gray-700`}
                          style={{
                            backgroundImage: slide.image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})` : '',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div className="absolute inset-0 p-3 text-white flex flex-col justify-end">
                            <h3 className="text-sm font-bold truncate">{slide.title}</h3>
                            <p className="text-xs opacity-90 truncate">{slide.subtitle}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Slide Details */}
                      <div className="lg:w-3/4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {slide.title}
                              </h3>
                              <Badge className={`${getSlideStatusColor(slide)} flex items-center gap-1`}>
                                {getSlideStatusIcon(slide)}
                                {getSlideStatusText(slide)}
                              </Badge>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Priority: {slide.priority || 1}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {slide.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Monitor className="w-4 h-4" />
                                <span className="truncate">{slide.buttonText || 'Shop Now'}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Eye className="w-4 h-4" />
                                <span>Link: {slide.buttonLink || '/shop'}</span>
                              </div>
                            </div>
                            
                            {(slide.startDate || slide.endDate) && (
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
                                {slide.startDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Start: {new Date(slide.startDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {slide.endDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>End: {new Date(slide.endDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 min-w-0 sm:min-w-[180px]">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openHeroSlideModal(slide)}
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteHeroSlide(slide._id || slide.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleHeroSlideStatus(slide._id || slide.id)}
                              className={`w-full ${
                                slide.isActive 
                                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              {slide.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-xs whitespace-nowrap">Priority:</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={slide.priority || 1}
                                onChange={(e) => {
                                  const newPriority = parseInt(e.target.value) || 1;
                                  const updatedSlides = heroSlides.map(s => 
                                    (s._id === slide._id || s.id === slide.id) 
                                      ? {...s, priority: newPriority}
                                      : s
                                  );
                                  setHeroSlides(updatedSlides);
                                }}
                                className="h-8 text-xs flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero Slide Modal */}
      <Dialog open={heroSlideModalOpen} onOpenChange={setHeroSlideModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHeroSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
            </DialogTitle>
            <DialogDescription>
              {editingHeroSlide 
                ? 'Modify the details of your hero slide' 
                : 'Create a new hero slide for the homepage'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={heroSlideForm.title}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, title: e.target.value})}
                  placeholder="Enter slide title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={heroSlideForm.subtitle}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, subtitle: e.target.value})}
                  placeholder="Enter slide subtitle"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={heroSlideForm.description}
                onChange={(e) => setHeroSlideForm({...heroSlideForm, description: e.target.value})}
                placeholder="Enter slide description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={heroSlideForm.image}
                onChange={(e) => setHeroSlideForm({...heroSlideForm, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={heroSlideForm.buttonText}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, buttonText: e.target.value})}
                  placeholder="Button text"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={heroSlideForm.buttonLink}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, buttonLink: e.target.value})}
                  placeholder="/shop"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={heroSlideForm.priority}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, priority: parseInt(e.target.value) || 1})}
                  min="1"
                  placeholder="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select 
                  value={heroSlideForm.isActive ? 'active' : 'inactive'} 
                  onValueChange={(value) => setHeroSlideForm({...heroSlideForm, isActive: value === 'active'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={heroSlideForm.startDate}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={heroSlideForm.endDate}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  value={heroSlideForm.backgroundColor}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, backgroundColor: e.target.value})}
                  placeholder="from-cyan-600 to-cyan-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <Input
                  id="textColor"
                  value={heroSlideForm.textColor}
                  onChange={(e) => setHeroSlideForm({...heroSlideForm, textColor: e.target.value})}
                  placeholder="text-white"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroSlideModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveHeroSlide}>
              {editingHeroSlide ? 'Update Slide' : 'Add Slide'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSlidesTab;