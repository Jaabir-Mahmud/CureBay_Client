import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  X,
  Pill,
  Heart,
  Circle,
  Syringe,
  Stethoscope,
  Tag
} from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
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

function CategoriesTab({ 
  categories, 
  setCategories, 
  activeTab 
}) {
  const navigate = useNavigate();
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryViewMode, setCategoryViewMode] = useState('grid'); // 'grid' or 'list'
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'Pill',
    color: 'cyan'
  });
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  // Category helper functions
  const getIconComponent = (iconName) => {
    const icons = {
      Pill,
      Heart,
      Circle,
      Syringe,
      Stethoscope,
      Tag
    };
    return icons[iconName] || Pill;
  };

  const getColorClasses = (color) => {
    const colors = {
      cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        border: 'border-cyan-200 dark:border-cyan-700',
        icon: 'bg-cyan-100 dark:bg-cyan-900/40',
        text: 'text-cyan-600 dark:text-cyan-400'
      },
      pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'border-pink-200 dark:border-pink-700',
        icon: 'bg-pink-100 dark:bg-pink-900/40',
        text: 'text-pink-600 dark:text-pink-400'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-700',
        icon: 'bg-green-100 dark:bg-green-900/40',
        text: 'text-green-600 dark:text-green-400'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-700',
        icon: 'bg-red-100 dark:bg-red-900/40',
        text: 'text-red-600 dark:text-red-400'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'bg-orange-100 dark:bg-orange-900/40',
        text: 'text-orange-600 dark:text-orange-400'
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-900/20',
        border: 'border-gray-200 dark:border-gray-700',
        icon: 'bg-gray-100 dark:bg-gray-900/40',
        text: 'text-gray-600 dark:text-gray-400'
      }
    };
    return colors[color] || colors.cyan;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    category.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        icon: 'Pill',
        color: 'cyan'
      });
    }
    setCategoryModalOpen(true);
  };

  const viewCategoryMedicines = (category) => {
    // Preserve current tab in the URL for proper back navigation
    navigate(`/dashboard/admin/categories/${category.id}/medicines?fromTab=${activeTab}`);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      icon: 'Pill',
      color: 'cyan'
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    if (!categoryForm.description.trim()) {
      toast.error('Category description is required');
      return;
    }

    try {
      let res;
      if (editingCategory) {
        // Check if this is a default category (numeric ID) that doesn't exist in backend
        const isDefaultCategory = typeof editingCategory.id === 'number' || !isNaN(editingCategory.id);
        
        if (isDefaultCategory) {
          // Create new category for default ones
          res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryForm),
          });
        } else {
          // Update existing category with valid MongoDB ObjectId
          res = await fetch(`/api/categories/${editingCategory.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryForm),
          });
        }
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }

      // Handle potential empty or invalid JSON responses
      let updatedCategory;
      try {
        updatedCategory = await res.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        updatedCategory = {}; // Use empty object as fallback
      }
      
      // Update the local categories state
      if (editingCategory) {
        const isDefaultCategory = typeof editingCategory.id === 'number' || !isNaN(editingCategory.id);
        
        if (isDefaultCategory) {
          // Replace the default category with the new one from backend
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.id === editingCategory.id 
                ? { ...updatedCategory, count: cat.count } // Preserve count from default
                : cat
            )
          );
        } else {
          // Update existing category
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.id === editingCategory.id 
                ? { ...cat, ...categoryForm, updatedAt: new Date().toISOString() }
                : cat
            )
          );
        }
      } else {
        // Use the actual category data from backend response if available
        const newCategory = updatedCategory.id ? updatedCategory : {
          ...categoryForm,
          id: Date.now(), // Fallback temporary ID
          count: 0,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setCategories(prevCategories => [...prevCategories, newCategory]);
      }
      
      closeCategoryModal();
      
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || `Failed to ${editingCategory ? 'update' : 'create'} category. Please try again.`);
    }
  };

  const openDeleteCategoryModal = (category) => {
    setCategoryToDelete(category);
    setDeleteCategoryModalOpen(true);
  };

  const closeDeleteCategoryModal = () => {
    setDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setIsDeletingCategory(true);
    try {
      // Check if this is a default category (numeric ID) that doesn't exist in backend
      const isDefaultCategory = typeof categoryToDelete.id === 'number' || !isNaN(categoryToDelete.id);
      
      if (isDefaultCategory) {
        // For default categories, just remove from local state
        setCategories(prevCategories => 
          prevCategories.filter(cat => cat.id !== categoryToDelete.id)
        );
        toast.success('Default category removed from view!');
      } else {
        // Delete from backend for real categories
        const res = await fetch(`/api/categories/${categoryToDelete.id}`, { 
          method: 'DELETE' 
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete category');
        }
        
        // Remove from local state
        setCategories(prevCategories => 
          prevCategories.filter(cat => cat.id !== categoryToDelete.id)
        );
        
        toast.success('Category deleted successfully!');
      }
      
      closeDeleteCategoryModal();
      
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. Please try again.');
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const toggleCategoryStatus = async (categoryId) => {
    try {
      // Check if this is a default category (numeric ID) that doesn't exist in backend
      const isDefaultCategory = typeof categoryId === 'number' || !isNaN(categoryId);
      
      if (isDefaultCategory) {
        // For default categories, just update local state
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.id === categoryId 
              ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
              : cat
          )
        );
        return;
      }

      // Update status in backend for real categories
      const res = await fetch(`/api/categories/${categoryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'toggle' })
      });

      if (!res.ok) {
        throw new Error('Failed to update category status');
      }

      const updatedCategory = await res.json();
      
      // Update local state
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, status: updatedCategory.status }
            : cat
        )
      );
      
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Failed to update category status');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Medicine Categories</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage and organize your medicine categories</p>
        </div>
        <Button onClick={() => openCategoryModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search and View Controls */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant={categoryViewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryViewMode('grid')}
                className="flex-1 sm:flex-none"
              >
                <Grid className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={categoryViewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryViewMode('list')}
                className="flex-1 sm:flex-none"
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Display */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          {categoryViewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                const colorClasses = getColorClasses(category.color);
                
                return (
                  <div 
                    key={category.id} 
                    className={`relative group rounded-lg border-2 ${colorClasses.border} ${colorClasses.bg} p-3 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorClasses.icon} flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClasses.text}`} />
                      </div>
                      <Badge 
                        variant={category.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                        onClick={() => toggleCategoryStatus(category.id)}
                      >
                        {category.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {category.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                        <span className={`font-medium ${colorClasses.text}`}>
                          {category.count.toLocaleString()} medicines
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Created {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="flex-1 text-xs"
                        onClick={() => viewCategoryMedicines(category)}
                      >
                        <Eye className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">View {category.name}</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <div className="flex gap-2 sm:flex-col lg:flex-row">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openCategoryModal(category)}
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                          onClick={() => openDeleteCategoryModal(category)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                const colorClasses = getColorClasses(category.color);
                
                return (
                  <div 
                    key={category.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow gap-3 sm:gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${colorClasses.icon} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {category.name}
                          </h3>
                          <Badge 
                            variant={category.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer hover:opacity-80 transition-opacity text-xs w-fit"
                            onClick={() => toggleCategoryStatus(category.id)}
                          >
                            {category.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {category.description}
                        </p>
                        <div className="sm:hidden mt-2">
                          <div className={`font-medium ${colorClasses.text} text-sm`}>
                            {category.count.toLocaleString()} medicines
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block text-right">
                        <div className={`font-medium ${colorClasses.text}`}>
                          {category.count.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">medicines</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => viewCategoryMedicines(category)}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          <Eye className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">View {category.name}</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openCategoryModal(category)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteCategoryModal(category)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {categorySearch ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
              </p>
              {!categorySearch && (
                <Button onClick={() => openCategoryModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Category
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingCategory 
                ? 'Update the category details below.' 
                : 'Add a new medicine category to organize your products.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Category Name</Label>
              <Input
                id="name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                placeholder="e.g., Tablets, Syrups"
                required
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                placeholder="Brief description of this category"
                rows={3}
                className="text-sm resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-sm">Icon</Label>
                <Select 
                  value={categoryForm.icon} 
                  onValueChange={(value) => setCategoryForm({...categoryForm, icon: value})}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pill">💊 Pill</SelectItem>
                    <SelectItem value="Heart">❤️ Heart</SelectItem>
                    <SelectItem value="Circle">⭕ Circle</SelectItem>
                    <SelectItem value="Syringe">💉 Syringe</SelectItem>
                    <SelectItem value="Stethoscope">🩺 Stethoscope</SelectItem>
                    <SelectItem value="Tag">🏷️ Tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm">Color Theme</Label>
                <Select 
                  value={categoryForm.color} 
                  onValueChange={(value) => setCategoryForm({...categoryForm, color: value})}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyan">🔵 Cyan</SelectItem>
                    <SelectItem value="pink">🩷 Pink</SelectItem>
                    <SelectItem value="green">🟢 Green</SelectItem>
                    <SelectItem value="red">🔴 Red</SelectItem>
                    <SelectItem value="orange">🟠 Orange</SelectItem>
                    <SelectItem value="gray">⚫ Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeCategoryModal} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Modal */}
      <Dialog open={deleteCategoryModalOpen} onOpenChange={setDeleteCategoryModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-left text-base sm:text-lg">Delete Category</DialogTitle>
                <DialogDescription className="text-left text-gray-600 dark:text-gray-300 text-sm">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {categoryToDelete && (
                  <>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${getColorClasses(categoryToDelete.color).icon} flex items-center justify-center`}>
                      {React.createElement(getIconComponent(categoryToDelete.icon), { 
                        className: `w-4 h-4 sm:w-5 sm:h-5 ${getColorClasses(categoryToDelete.color).text}` 
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {categoryToDelete.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                        {categoryToDelete.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorClasses(categoryToDelete.color).bg} ${getColorClasses(categoryToDelete.color).text}`}>
                          {categoryToDelete.count} medicines
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${categoryToDelete.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                          {categoryToDelete.status}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium">Warning:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• All medicines in this category will be affected</li>
                    <li>• Category data will be permanently deleted</li>
                    <li>• This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeDeleteCategoryModal}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={deleteCategory}
              disabled={isDeletingCategory}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2 w-full sm:w-auto"
            >
              {isDeletingCategory ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoriesTab;
