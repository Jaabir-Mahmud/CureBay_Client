import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Edit2,
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
import { useLanguage } from '../../../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../../../lib/i18n'; // Added translation import

function CategoriesTab({ 
  categories, 
  setCategories, 
  activeTab 
}) {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Use language context
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
      toast.error(t('admin.categories.nameRequired', language));
      return;
    }
    
    if (!categoryForm.description.trim()) {
      toast.error(t('admin.categories.descriptionRequired', language));
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
        throw new Error(errorData.message || t('admin.categories.failed', language));
      }

      const updatedCategory = await res.json();
      
      if (editingCategory) {
        // Update existing category in state
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.id === editingCategory.id ? { ...updatedCategory, id: updatedCategory._id } : cat
          )
        );
        toast.success(t('admin.categories.updated', language));
      } else {
        // Add new category to state
        setCategories(prevCategories => [...prevCategories, { ...updatedCategory, id: updatedCategory._id }]);
        toast.success(t('admin.categories.created', language));
      }
      
      closeCategoryModal();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || t('admin.categories.error', language));
    }
  };

  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteCategoryModalOpen(true);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setIsDeletingCategory(true);
    try {
      // Check if this is a default category (numeric ID) that doesn't exist in backend
      const isDefaultCategory = typeof categoryToDelete.id === 'number' || !isNaN(categoryToDelete.id);
      
      if (!isDefaultCategory) {
        // Delete from backend only if it's not a default category
        const res = await fetch(`/api/categories/${categoryToDelete.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || t('admin.categories.deleteFailed', language));
        }
      }
      
      // Remove from state
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryToDelete.id));
      toast.success(t('admin.categories.deleted', language));
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || t('admin.categories.deleteError', language));
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  // Icon options for category form
  const iconOptions = [
    { value: 'Pill', label: t('admin.categories.pill', language) },
    { value: 'Heart', label: t('admin.categories.heart', language) },
    { value: 'Circle', label: t('admin.categories.circle', language) },
    { value: 'Syringe', label: t('admin.categories.syringe', language) },
    { value: 'Stethoscope', label: t('admin.categories.stethoscope', language) },
    { value: 'Tag', label: t('admin.categories.tag', language) }
  ];

  // Color options for category form
  const colorOptions = [
    { value: 'cyan', label: t('admin.categories.cyan', language) },
    { value: 'pink', label: t('admin.categories.pink', language) },
    { value: 'green', label: t('admin.categories.green', language) },
    { value: 'red', label: t('admin.categories.red', language) },
    { value: 'orange', label: t('admin.categories.orange', language) },
    { value: 'gray', label: t('admin.categories.gray', language) }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('admin.categories.search', language)}
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="pl-10"
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={categoryViewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={categoryViewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button onClick={() => openCategoryModal()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('admin.categories.add', language)}
          </Button>
        </div>
      </div>

      {/* Categories Grid/List */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{t('admin.categories.noCategories', language)}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('admin.categories.noCategoriesDesc', language)}</p>
        </div>
      ) : categoryViewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            const colorClasses = getColorClasses(category.color);
            
            return (
              <Card key={category.id} className={`${colorClasses.bg} ${colorClasses.border} border transition-all duration-300 hover:shadow-lg`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${colorClasses.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewCategoryMedicines(category)}
                        className="h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCategoryModal(category)}
                        className="h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDeleteCategory(category)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-4 mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {category.count} {t('admin.categories.medicines', language)}
                    </Badge>
                    <Badge variant={category.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {category.status === 'active' ? t('admin.categories.active', language) : t('admin.categories.inactive', language)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                const colorClasses = getColorClasses(category.color);
                
                return (
                  <div key={category.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${colorClasses.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">{category.name}</h3>
                          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {category.count} {t('admin.categories.medicines', language)}
                            </Badge>
                            <Badge variant={category.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {category.status === 'active' ? t('admin.categories.active', language) : t('admin.categories.inactive', language)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">{category.description}</p>
                      </div>
                      <div className="ml-4 flex space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewCategoryMedicines(category)}
                          className="h-8 w-8 p-0 flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCategoryModal(category)}
                          className="h-8 w-8 p-0 flex items-center justify-center"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDeleteCategory(category)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? t('admin.categories.edit', language) : t('admin.categories.add', language)}</DialogTitle>
            <DialogDescription>
              {editingCategory ? t('admin.categories.editDesc', language) : t('admin.categories.addDesc', language)}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">{t('admin.categories.name', language)}</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  placeholder={t('admin.categories.namePlaceholder', language)}
                />
              </div>
              <div>
                <Label htmlFor="category-description">{t('admin.categories.description', language)}</Label>
                <Textarea
                  id="category-description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder={t('admin.categories.descriptionPlaceholder', language)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category-icon">{t('admin.categories.icon', language)}</Label>
                <Select value={categoryForm.icon} onValueChange={(value) => setCategoryForm({...categoryForm, icon: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.categories.selectIcon', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category-color">{t('admin.categories.color', language)}</Label>
                <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm({...categoryForm, color: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.categories.selectColor', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={closeCategoryModal}>
                {t('common.cancel', language)}
              </Button>
              <Button type="submit">
                {editingCategory ? t('admin.categories.update', language) : t('admin.categories.create', language)}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteCategoryModalOpen} onOpenChange={setDeleteCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {t('admin.categories.confirmDelete', language)}
            </DialogTitle>
            <DialogDescription>
              {t('admin.categories.confirmDeleteDesc', language)} <span className="font-semibold">{categoryToDelete?.name}</span>?
              {categoryToDelete?.count > 0 && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    {t('admin.categories.deleteWarning', language)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={cancelDeleteCategory} disabled={isDeletingCategory}>
              {t('common.cancel', language)}
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={deleteCategory} 
              disabled={isDeletingCategory}
              className="flex items-center gap-2"
            >
              {isDeletingCategory && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {t('admin.categories.delete', language)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoriesTab;