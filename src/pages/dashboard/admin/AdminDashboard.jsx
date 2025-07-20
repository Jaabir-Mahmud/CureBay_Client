import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  BarChart3,
  UserCheck,
  ShoppingBag,
  CreditCard,
  FileText,
  Megaphone,
  AlertTriangle,
  Trash2,
  X,
  RefreshCw,
  Search,
  Plus,
  Edit,
  Eye,
  Filter,
  Grid,
  List,
  Tag,
  Pill,
  Heart,
  Stethoscope,
  Syringe,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import Lottie from 'lottie-react';
import moneyAnim from '../../../assets/money.json';
import usersAnim from '../../../assets/users.json';
import packageAnim from '../../../assets/package.json';
import ordersAnim from '../../../assets/orders.json';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { validateSession } = useAuth();

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  // Keyboard shortcut for refresh (Ctrl+R or F5)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        if (!isRefreshing) {
          refreshUsers();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRefreshing]);

  const updateRole = async (id, newRole) => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setUsers(users => users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
    } catch {
      alert('Failed to update role');
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${userToDelete._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users => users.filter(u => u._id !== userToDelete._id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
      
      // Trigger session validation for all connected users
      // This will help log out the deleted user if they're currently online
      setTimeout(() => {
        validateSession();
      }, 1000);
    } catch {
      alert('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const refreshUsers = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
      toast.success(`Refreshed user list - ${data.length} users found`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      setError('Failed to refresh users');
      console.error('Error refreshing users:', err);
      toast.error('Failed to refresh user list', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}/active`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      setUsers(users => users.map(u => (u._id === id ? { ...u, isActive: data.isActive } : u)));
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredUsers = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full max-w-xs"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={refreshUsers}
                disabled={isRefreshing}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 transition-all duration-200"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh user list (Ctrl+R or F5)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Active</th>
              <th className="py-3 px-4 text-left">Registered</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr
                key={user._id}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
              >
                <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                <td className="py-2 px-4 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : user.role === 'seller' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => toggleActive(user._id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition
                      ${user.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <select
                    value={user.role}
                    onChange={e => updateRole(user._id, e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="px-3 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold text-xs hover:bg-red-200 dark:hover:bg-red-800/60 transition flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-left">Delete User</DialogTitle>
                <DialogDescription className="text-left text-gray-600 dark:text-gray-300">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userToDelete?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {userToDelete?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${userToDelete?.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : userToDelete?.role === 'seller' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {userToDelete?.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${userToDelete?.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {userToDelete?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium">Warning:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• All user data will be permanently deleted</li>
                    <li>• Associated orders and transactions will be affected</li>
                    <li>• This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={deleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  
  // Categories state
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Tablets', 
      count: 2450, 
      description: 'Oral solid dosage forms for various medical conditions',
      icon: 'Pill',
      color: 'blue',
      status: 'active',
      createdAt: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 2, 
      name: 'Syrups', 
      count: 1280, 
      description: 'Liquid medications for easy administration',
      icon: 'Heart',
      color: 'pink',
      status: 'active',
      createdAt: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 3, 
      name: 'Capsules', 
      count: 1890, 
      description: 'Encapsulated medications for controlled release',
      icon: 'Circle',
      color: 'green',
      status: 'active',
      createdAt: '2024-01-08',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 4, 
      name: 'Injections', 
      count: 890, 
      description: 'Injectable medications for immediate effect',
      icon: 'Syringe',
      color: 'red',
      status: 'active',
      createdAt: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 5, 
      name: 'Supplements', 
      count: 1560, 
      description: 'Nutritional supplements and vitamins',
      icon: 'Stethoscope',
      color: 'orange',
      status: 'active',
      createdAt: '2024-01-03',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 6, 
      name: 'Others', 
      count: 340, 
      description: 'Miscellaneous medical products and devices',
      icon: 'Tag',
      color: 'gray',
      status: 'inactive',
      createdAt: '2024-01-01',
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=200&fit=crop&auto=format'
    }
  ]);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryViewMode, setCategoryViewMode] = useState('grid'); // 'grid' or 'list'
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'Pill',
    color: 'blue'
  });
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  useEffect(() => {
    // Set default stats to prevent breaking when API fails
    setStats({
      totalRevenue: 125000,
      revenueGrowth: 12.5,
      paidTotal: 98000,
      pendingTotal: 27000,
      totalUsers: 2450,
      userGrowth: 8.3,
      totalSellers: 89,
      totalMedicines: 6410,
      totalOrders: 1890
    });

    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => {
        console.error('Error fetching overview:', err);
        // Keep default stats if API fails
      });
    
    fetch('/api/admin/recent-users')
      .then(res => res.json())
      .then(data => setRecentUsers(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching recent users:', err);
        setRecentUsers([]);
      });
    
    fetch('/api/admin/pending-payments')
      .then(res => res.json())
      .then(data => setPendingPayments(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching pending payments:', err);
        setPendingPayments([]);
      });

    // Fetch categories from backend
    fetch('/api/categories')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        // Keep default categories if API fails - they will be used as fallback
        toast.error('Failed to load categories from server. Using default data.', {
          duration: 4000,
          position: 'top-right',
        });
      });
  }, []);

  useEffect(() => {
    const setCardColors = () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.style.setProperty('--card-1', '#23272f');
        document.documentElement.style.setProperty('--card-2', '#2d323c');
        document.documentElement.style.setProperty('--card-3', '#31363f');
        document.documentElement.style.setProperty('--card-4', '#22343c');
        document.documentElement.style.setProperty('--card-5', '#1e3a34');
        document.documentElement.style.setProperty('--card-6', '#1e293b');
        document.documentElement.style.setProperty('--card-7', '#22343c');
      } else {
        document.documentElement.style.setProperty('--card-1', '#fc9f5b');
        document.documentElement.style.setProperty('--card-2', '#FBD1A2');
        document.documentElement.style.setProperty('--card-3', '#ECE4B7');
        document.documentElement.style.setProperty('--card-4', '#7DCFB6');
        document.documentElement.style.setProperty('--card-5', '#33CA7F');
        document.documentElement.style.setProperty('--card-6', '#33A1FD');
        document.documentElement.style.setProperty('--card-7', '#61E8E1');
      }
    };

    setCardColors();

    // Watch for class changes on <html>
    const observer = new MutationObserver(setCardColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Also listen for storage events in case dark mode is toggled in another tab
    window.addEventListener('storage', setCardColors);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', setCardColors);
    };
  }, []);

  const acceptPayment = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/accept-payment/${orderId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to accept payment');
      setPendingPayments(payments => payments.filter(p => p.id !== orderId));
      // Optionally, refetch stats to update paid/pending totals
      fetch('/api/admin/overview')
        .then(res => res.json())
        .then(data => setStats(data));
    } catch {
      alert('Failed to accept payment');
    }
  };

  if (!stats) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
      </div>
    </div>
  );

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
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'bg-blue-100 dark:bg-blue-800'
      },
      pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        text: 'text-pink-600 dark:text-pink-400',
        border: 'border-pink-200 dark:border-pink-800',
        icon: 'bg-pink-100 dark:bg-pink-800'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        icon: 'bg-green-100 dark:bg-green-800'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        icon: 'bg-red-100 dark:bg-red-800'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        icon: 'bg-orange-100 dark:bg-orange-800'
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-800/20',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-700',
        icon: 'bg-gray-100 dark:bg-gray-700'
      }
    };
    return colors[color] || colors.blue;
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
        color: 'blue'
      });
    }
    setCategoryModalOpen(true);
  };

  const viewCategoryMedicines = (category) => {
    navigate(`/dashboard/admin/categories/${category.id}/medicines`);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      icon: 'Pill',
      color: 'blue'
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
          // For default categories, create a new one instead of updating
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
        // Create new category
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

      const updatedCategory = await res.json();
      
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
          toast.success('Category created successfully in database!');
        } else {
          // Update existing category
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.id === editingCategory.id 
                ? { ...cat, ...categoryForm, updatedAt: new Date().toISOString() }
                : cat
            )
          );
          toast.success('Category updated successfully!');
        }
      } else {
        // Use the actual category data from backend response if available
        const newCategory = updatedCategory.id ? updatedCategory : {
          ...categoryForm,
          id: Date.now(), // Fallback temporary ID
          count: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop&auto=format'
        };
        setCategories(prevCategories => [...prevCategories, newCategory]);
        toast.success('Category created successfully!');
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
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to delete category');
        }
        
        // Remove from local state
        setCategories(prevCategories => 
          prevCategories.filter(cat => cat.id !== categoryToDelete.id)
        );
        
        toast.success('Category deleted successfully!');
      }
      
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
      
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category. Please try again.');
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
        toast.success('Category status updated locally!');
        return;
      }
      
      // Update status in backend for real categories
      const res = await fetch(`/api/categories/${categoryId}/toggle-status`, { 
        method: 'PATCH' 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to toggle category status');
      }
      
      // Update local state
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
            : cat
        )
      );
      
      toast.success('Category status updated successfully!');
      
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error(error.message || 'Failed to update category status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your CureBay platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-blue-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-blue-400 group-hover/card:shadow-lg group-hover/card:shadow-blue-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Total Revenue
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
                    ${stats.totalRevenue?.toLocaleString()}
                  </CardItem>
                  <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
                    {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% from last month
                  </CardItem>
                </CardBody>
              </CardContainer>
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-green-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-green-400 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Paid Total
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2 relative z-10">
                    ${stats.paidTotal?.toLocaleString()}
                  </CardItem>
                  <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
                    {stats.totalRevenue ? ((stats.paidTotal / stats.totalRevenue) * 100).toFixed(1) : 0}% of total revenue
                  </CardItem>
                </CardBody>
              </CardContainer>
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-orange-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-orange-400 group-hover/card:shadow-lg group-hover/card:shadow-orange-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Pending Total
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={moneyAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2 relative z-10">
                    ${stats.pendingTotal?.toLocaleString()}
                  </CardItem>
                  <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
                    {stats.totalRevenue ? ((stats.pendingTotal / stats.totalRevenue) * 100).toFixed(1) : 0}% of total revenue
                  </CardItem>
                </CardBody>
              </CardContainer>
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-blue-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-blue-400 group-hover/card:shadow-lg group-hover/card:shadow-blue-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Total Users
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={usersAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
                    {stats.totalUsers?.toLocaleString()}
                  </CardItem>
                  <CardItem translateZ={20} className="text-xs text-gray-700 dark:text-gray-300 mt-1 relative z-10">
                    {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth}% from last month
                  </CardItem>
                </CardBody>
              </CardContainer>
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-green-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-green-400 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Total Sellers
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={usersAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
                    {stats.totalSellers?.toLocaleString()}
                  </CardItem>
                </CardBody>
              </CardContainer>
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-blue-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-blue-400 group-hover/card:shadow-lg group-hover/card:shadow-blue-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Total Medicines
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={packageAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
                    {stats.totalMedicines?.toLocaleString()}
                  </CardItem>
                </CardBody>
              </CardContainer>
              <CardContainer className="inter-var">
                <CardBody className="relative bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg rounded-2xl p-6 transition-all duration-300 group/card hover:shadow-2xl hover:shadow-green-400/20">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover/card:border-green-400 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30 transition-all duration-300" style={{ zIndex: 1 }} />
                  <CardItem translateZ={50} className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
                    Total Orders
                  </CardItem>
                  <CardItem translateZ={60} className="mt-2 relative z-10">
                    <Lottie animationData={ordersAnim} loop={true} style={{ height: 60, width: 60 }} />
                  </CardItem>
                  <CardItem translateZ={40} className="text-2xl font-bold text-gray-900 dark:text-white mt-2 relative z-10">
                    {stats.totalOrders?.toLocaleString()}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(recentUsers) && recentUsers.map((user) => (
                      <div key={user._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'seller' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(!pendingPayments || pendingPayments.length === 0) && <div className="text-gray-400">No pending payments.</div>}
                    {Array.isArray(pendingPayments) && pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #{payment.id}</p>
                          <p className="text-sm text-gray-600">{payment.customer} ({payment.email})</p>
                          <p className="text-xs text-gray-400">{payment.date ? new Date(payment.date).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${payment.amount}</p>
                          <Button size="sm" className="mt-1" onClick={() => acceptPayment(payment.id)}>
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ManageUsers />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medicine Categories</h2>
                <p className="text-gray-600 dark:text-gray-300">Manage and organize your medicine categories</p>
              </div>
              <Button onClick={() => openCategoryModal()} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {/* Search and View Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Display */}
            <Card>
              <CardContent className="p-6">
                {categoryViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => {
                      const IconComponent = getIconComponent(category.icon);
                      const colorClasses = getColorClasses(category.color);
                      
                      return (
                        <div 
                          key={category.id} 
                          className={`relative group rounded-lg border-2 ${colorClasses.border} ${colorClasses.bg} p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-full ${colorClasses.icon} flex items-center justify-center`}>
                              <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                            </div>
                            <Badge 
                              variant={category.status === 'active' ? 'default' : 'secondary'}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => toggleCategoryStatus(category.id)}
                            >
                              {category.status}
                            </Badge>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {category.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className={`font-medium ${colorClasses.text}`}>
                                {category.count.toLocaleString()} medicines
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                Created {new Date(category.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="flex-1"
                              onClick={() => viewCategoryMedicines(category)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View {category.name}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openCategoryModal(category)}
                            >
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCategories.map((category) => {
                      const IconComponent = getIconComponent(category.icon);
                      const colorClasses = getColorClasses(category.color);
                      
                      return (
                        <div 
                          key={category.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${colorClasses.icon} flex items-center justify-center`}>
                              <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {category.name}
                                </h3>
                                <Badge 
                                  variant={category.status === 'active' ? 'default' : 'secondary'}
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => toggleCategoryStatus(category.id)}
                                >
                                  {category.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
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
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View {category.name}
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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory 
                      ? 'Update the category details below.' 
                      : 'Add a new medicine category to organize your products.'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      placeholder="e.g., Tablets, Syrups"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      placeholder="Brief description of this category"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Select 
                        value={categoryForm.icon} 
                        onValueChange={(value) => setCategoryForm({...categoryForm, icon: value})}
                      >
                        <SelectTrigger>
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
                      <Label htmlFor="color">Color Theme</Label>
                      <Select 
                        value={categoryForm.color} 
                        onValueChange={(value) => setCategoryForm({...categoryForm, color: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">🔵 Blue</SelectItem>
                          <SelectItem value="pink">🩷 Pink</SelectItem>
                          <SelectItem value="green">🟢 Green</SelectItem>
                          <SelectItem value="red">🔴 Red</SelectItem>
                          <SelectItem value="orange">🟠 Orange</SelectItem>
                          <SelectItem value="gray">⚫ Gray</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={closeCategoryModal}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Category Confirmation Modal */}
            <Dialog open={deleteCategoryModalOpen} onOpenChange={setDeleteCategoryModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-left">Delete Category</DialogTitle>
                      <DialogDescription className="text-left text-gray-600 dark:text-gray-300">
                        This action cannot be undone.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {categoryToDelete && (
                        <>
                          <div className={`w-10 h-10 rounded-full ${getColorClasses(categoryToDelete.color).icon} flex items-center justify-center`}>
                            {React.createElement(getIconComponent(categoryToDelete.icon), { 
                              className: `w-5 h-5 ${getColorClasses(categoryToDelete.color).text}` 
                            })}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {categoryToDelete.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {categoryToDelete.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
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

                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={closeDeleteCategoryModal}
                    className="flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    onClick={deleteCategory}
                    disabled={isDeletingCategory}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2"
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
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>Manage all payment transactions:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View pending and paid transactions</li>
                      <li>Accept or reject pending payments</li>
                      <li>Generate payment reports</li>
                      <li>Handle refunds and disputes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Sales Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>Generate comprehensive sales reports:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Filter reports by date range</li>
                      <li>Export in PDF, DOC, CSV, or XLSX format</li>
                      <li>View medicine-wise sales data</li>
                      <li>Seller and buyer analytics</li>
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button>Generate Report</Button>
                    <Button variant="outline">Export Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <CardTitle>Manage Banner Advertisements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>Control homepage slider advertisements:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View all advertised medicines</li>
                      <li>Toggle medicines on/off the slider</li>
                      <li>Manage seller advertisement requests</li>
                      <li>Set advertisement priorities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

