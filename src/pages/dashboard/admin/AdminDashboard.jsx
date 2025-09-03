import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Circle,
  Image,
  Monitor,
  RotateCcw,
  Clock,
  Download,
  Calendar
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
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 transition-all duration-300">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:max-w-xs text-sm"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-start sm:justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={refreshUsers}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 transition-all duration-200"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Refresh</span>
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
      </div>
      <div className="overflow-x-auto -mx-3 sm:-mx-4">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">Name</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">Email</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">Role</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium hidden md:table-cell">Active</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium hidden lg:table-cell">Registered</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 sm:hidden truncate max-w-[120px]">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                    <span className="truncate max-w-[200px] block">{user.email}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 capitalize">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold
                      ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : user.role === 'seller' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {user.role}
                    </span>
                    <div className="md:hidden mt-1">
                      <button
                        onClick={() => toggleActive(user._id)}
                        className={`px-1.5 py-0.5 rounded-full text-xs font-semibold transition
                          ${user.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleActive(user._id)}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition
                        ${user.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <select
                        value={user.role}
                        onChange={e => updateRole(user._id, e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 rounded px-1 sm:px-2 py-0.5 sm:py-1 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-xs w-full sm:w-auto"
                      >
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold text-xs hover:bg-red-200 dark:hover:bg-red-800/60 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 size={10} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'overview';
  });
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

  // Payment management state
  const [payments, setPayments] = useState([]);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all'); // all, pending, accepted, rejected
  const [paymentDateFilter, setPaymentDateFilter] = useState('all'); // all, today, week, month
  const [selectedPayments, setSelectedPayments] = useState(new Set());
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAction, setPaymentAction] = useState(''); // accept, reject
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Sales Report state
  const [salesData, setSalesData] = useState([]);
  const [reportDateRange, setReportDateRange] = useState('month'); // week, month, quarter, year, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportType, setReportType] = useState('overview'); // overview, medicines, sellers, customers
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Banner Advertisement state
  const [bannerAds, setBannerAds] = useState([]);
  const [bannerSearch, setBannerSearch] = useState('');
  const [bannerStatusFilter, setBannerStatusFilter] = useState('all'); // all, active, inactive, pending
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    priority: 1,
    isActive: true,
    startDate: '',
    endDate: ''
  });
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [heroSlideForm, setHeroSlideForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    backgroundColor: 'from-blue-600 to-blue-800',
    textColor: 'text-white',
    isActive: true
  });
  const [heroSlideModalOpen, setHeroSlideModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState(null);
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

  // Function to handle tab changes and update URL
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Update activeTab when URL search params change (e.g., browser back/forward)
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

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

    // Fetch payments data
    fetch('/api/admin/payments')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPayments(data);
        }
      })
      .catch(err => {
        console.error('Error fetching payments:', err);
        // Use mock data if API fails
        setPayments([
          {
            id: 'PAY-001',
            orderId: 'ORD-2024-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            amount: 45.99,
            paymentMethod: 'Credit Card',
            status: 'pending',
            createdAt: '2024-01-15T10:30:00Z',
            medicines: [
              { name: 'Paracetamol 500mg', quantity: 2, price: 19.99 },
              { name: 'Vitamin D3', quantity: 1, price: 24.99 }
            ],
            paymentDetails: {
              cardLast4: '1234',
              transactionId: 'TXN-ABC123'
            }
          },
          {
            id: 'PAY-002',
            orderId: 'ORD-2024-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            amount: 89.50,
            paymentMethod: 'PayPal',
            status: 'accepted',
            createdAt: '2024-01-14T15:45:00Z',
            acceptedAt: '2024-01-14T16:00:00Z',
            medicines: [
              { name: 'Antibiotic Capsules', quantity: 1, price: 34.99 },
              { name: 'Cough Syrup', quantity: 2, price: 12.99 }
            ],
            paymentDetails: {
              paypalEmail: 'jane@example.com',
              transactionId: 'PP-XYZ789'
            }
          },
          {
            id: 'PAY-003',
            orderId: 'ORD-2024-003',
            customerName: 'Bob Johnson',
            customerEmail: 'bob@example.com',
            amount: 156.75,
            paymentMethod: 'Bank Transfer',
            status: 'rejected',
            createdAt: '2024-01-13T09:20:00Z',
            rejectedAt: '2024-01-13T11:30:00Z',
            rejectReason: 'Insufficient bank verification documents',
            medicines: [
              { name: 'Insulin Pen', quantity: 2, price: 69.99 },
              { name: 'Blood Glucose Strips', quantity: 1, price: 16.77 }
            ],
            paymentDetails: {
              bankAccount: '****5678',
              referenceNumber: 'BT-REF456'
            }
          },
          {
            id: 'PAY-004',
            orderId: 'ORD-2024-004',
            customerName: 'Alice Brown',
            customerEmail: 'alice@example.com',
            amount: 67.99,
            paymentMethod: 'Credit Card',
            status: 'pending',
            createdAt: '2024-01-12T14:20:00Z',
            medicines: [
              { name: 'Multivitamin Tablets', quantity: 3, price: 21.99 }
            ],
            paymentDetails: {
              cardLast4: '5678',
              transactionId: 'TXN-DEF456'
            }
          }
        ]);
        toast.error('Failed to load payments from server. Using sample data.', {
          duration: 4000,
          position: 'top-right',
        });
      });

    // Initialize banner ads data
    setBannerAds([
      {
        id: 1,
        title: 'Summer Health Sale',
        description: 'Save up to 30% on vitamins and supplements this summer season',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&auto=format',
        link: '/category/supplements',
        priority: 5,
        isActive: true,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        views: 15420,
        clicks: 892
      },
      {
        id: 2,
        title: 'New Diabetes Care Products',
        description: 'Comprehensive diabetes management solutions now available',
        image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&h=400&fit=crop&auto=format',
        link: '/category/diabetes',
        priority: 4,
        isActive: true,
        startDate: '2024-01-15',
        endDate: '2024-06-15',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        views: 8750,
        clicks: 456
      },
      {
        id: 3,
        title: 'Heart Health Awareness',
        description: 'Take care of your heart with our specialized cardiac medications',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=400&fit=crop&auto=format',
        link: '/category/cardiac',
        priority: 3,
        isActive: false,
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
        views: 5230,
        clicks: 234
      },
      {
        id: 4,
        title: 'Children\'s Health Week',
        description: 'Special discounts on pediatric medicines and vitamins',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&auto=format',
        link: '/category/pediatric',
        priority: 2,
        isActive: true,
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
        views: 3200,
        clicks: 128
      }
    ]);
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

  // Hero Slides Management Functions
  const openHeroSlideModal = (slide = null) => {
    if (slide) {
      setEditingHeroSlide(slide);
      setHeroSlideForm({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        image: slide.image || '',
        buttonText: slide.buttonText || 'Shop Now',
        buttonLink: slide.buttonLink || '/shop',
        backgroundColor: slide.backgroundColor || 'from-blue-600 to-blue-800',
        textColor: slide.textColor || 'text-white',
        isActive: slide.isActive !== undefined ? slide.isActive : true
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
        backgroundColor: 'from-blue-600 to-blue-800',
        textColor: 'text-white',
        isActive: true
      });
    }
    setHeroSlideModalOpen(true);
  };

  const saveHeroSlide = async () => {
    try {
      if (editingHeroSlide) {
        // Update existing slide
        const updatedSlides = heroSlides.map(slide => 
          slide.id === editingHeroSlide.id 
            ? { ...slide, ...heroSlideForm }
            : slide
        );
        setHeroSlides(updatedSlides);
        toast.success('Hero slide updated successfully!');
      } else {
        // Add new slide
        const newSlide = {
          id: Date.now(),
          ...heroSlideForm,
          createdAt: new Date().toISOString()
        };
        setHeroSlides([...heroSlides, newSlide]);
        toast.success('Hero slide added successfully!');
      }
      setHeroSlideModalOpen(false);
    } catch (error) {
      console.error('Error saving hero slide:', error);
      toast.error('Failed to save hero slide. Please try again.');
    }
  };

  const deleteHeroSlide = (slideId) => {
    const slide = heroSlides.find(s => s.id === slideId);
    if (window.confirm(`Are you sure you want to delete "${slide?.title}"?`)) {
      setHeroSlides(heroSlides.filter(s => s.id !== slideId));
      toast.success('Hero slide deleted successfully!');
    }
  };

  const toggleHeroSlideStatus = (slideId) => {
    setHeroSlides(heroSlides.map(slide => 
      slide.id === slideId 
        ? { ...slide, isActive: !slide.isActive }
        : slide
    ));
    toast.success('Hero slide status updated!');
  };

  // Initialize hero slides with mock data
  useEffect(() => {
    const mockHeroSlides = [
      {
        id: 1,
        title: 'Quality Healthcare Solutions',
        subtitle: 'Your trusted partner for medical needs',
        description: 'Discover our comprehensive range of medicines and healthcare products with verified quality and competitive pricing.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop&auto=format',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        backgroundColor: 'from-blue-600 to-blue-800',
        textColor: 'text-white',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Premium Vitamins & Supplements',
        subtitle: 'Boost your immunity naturally',
        description: 'Explore our premium collection of vitamins and supplements to support your daily health and wellness journey.',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop&auto=format',
        buttonText: 'Browse Supplements',
        buttonLink: '/category/supplements',
        backgroundColor: 'from-green-600 to-green-800',
        textColor: 'text-white',
        isActive: true,
        createdAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 3,
        title: 'Fast & Reliable Delivery',
        subtitle: 'Get your medicines delivered safely',
        description: 'Experience our quick delivery service with proper packaging and temperature control for all your medical needs.',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=600&fit=crop&auto=format',
        buttonText: 'Learn More',
        buttonLink: '/about',
        backgroundColor: 'from-purple-600 to-purple-800',
        textColor: 'text-white',
        isActive: false,
        createdAt: '2024-01-03T00:00:00Z'
      }
    ];
    setHeroSlides(mockHeroSlides);
  }, []);

  // Payment Management Functions
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(paymentSearch.toLowerCase());
    
    const matchesStatus = paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;
    
    let matchesDate = true;
    if (paymentDateFilter !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (paymentDateFilter) {
        case 'today':
          matchesDate = paymentDate >= today;
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const openPaymentModal = (payment, action) => {
    setSelectedPayment(payment);
    setPaymentAction(action);
    setRejectReason('');
    setPaymentModalOpen(true);
  };

  const processPayment = async () => {
    if (!selectedPayment) return;
    
    setIsProcessingPayment(true);
    try {
      const endpoint = paymentAction === 'accept' 
        ? `/api/admin/payments/${selectedPayment.id}/accept`
        : `/api/admin/payments/${selectedPayment.id}/reject`;
      
      const body = paymentAction === 'reject' && rejectReason 
        ? JSON.stringify({ reason: rejectReason })
        : null;
      
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body
      });
      
      if (!res.ok) throw new Error(`Failed to ${paymentAction} payment`);
      
      // Update local state
      const updatedPayments = payments.map(payment => 
        payment.id === selectedPayment.id 
          ? { 
              ...payment, 
              status: paymentAction === 'accept' ? 'accepted' : 'rejected',
              [`${paymentAction}edAt`]: new Date().toISOString(),
              ...(paymentAction === 'reject' && rejectReason ? { rejectReason } : {})
            }
          : payment
      );
      setPayments(updatedPayments);
      
      // Update stats if necessary
      if (paymentAction === 'accept') {
        setStats(prevStats => ({
          ...prevStats,
          paidTotal: prevStats.paidTotal + selectedPayment.amount,
          pendingTotal: prevStats.pendingTotal - selectedPayment.amount
        }));
      }
      
      toast.success(`Payment ${paymentAction}ed successfully!`);
      setPaymentModalOpen(false);
      
    } catch (error) {
      console.error(`Error ${paymentAction}ing payment:`, error);
      toast.error(`Failed to ${paymentAction} payment. Please try again.`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleBulkPaymentAction = async (action) => {
    if (selectedPayments.size === 0) {
      toast.error('Please select payments to process.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${selectedPayments.size} selected payment(s)?`
    );
    
    if (!confirmed) return;
    
    setIsProcessingPayment(true);
    try {
      const promises = Array.from(selectedPayments).map(paymentId => {
        const endpoint = `/api/admin/payments/${paymentId}/${action}`;
        return fetch(endpoint, { method: 'PATCH' });
      });
      
      await Promise.all(promises);
      
      // Update local state
      const updatedPayments = payments.map(payment => 
        selectedPayments.has(payment.id)
          ? { 
              ...payment, 
              status: action === 'accept' ? 'accepted' : 'rejected',
              [`${action}edAt`]: new Date().toISOString()
            }
          : payment
      );
      setPayments(updatedPayments);
      setSelectedPayments(new Set());
      
      toast.success(`${selectedPayments.size} payments ${action}ed successfully!`);
      
    } catch (error) {
      console.error(`Error processing bulk ${action}:`, error);
      toast.error(`Failed to ${action} selected payments. Please try again.`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const togglePaymentSelection = (paymentId) => {
    setSelectedPayments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paymentId)) {
        newSet.delete(paymentId);
      } else {
        newSet.add(paymentId);
      }
      return newSet;
    });
  };

  const selectAllPayments = () => {
    const pendingPaymentIds = filteredPayments
      .filter(p => p.status === 'pending')
      .map(p => p.id);
    setSelectedPayments(new Set(pendingPaymentIds));
  };

  const clearPaymentSelection = () => {
    setSelectedPayments(new Set());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCard className="w-4 h-4" />;
      case 'paypal':
        return <DollarSign className="w-4 h-4" />;
      case 'bank transfer':
        return <FileText className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  // Sales Report Functions
  const generateSalesReport = async () => {
    setIsGeneratingReport(true);
    try {
      let startDate, endDate;
      const now = new Date();
      
      switch (reportDateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = now;
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = now;
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = now;
          break;
        case 'custom':
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = now;
      }
      
      // In real implementation, this would call the API
      // const response = await fetch(`/api/admin/reports/sales?start=${startDate.toISOString()}&end=${endDate.toISOString()}&type=${reportType}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockReportData = {
        overview: {
          totalSales: 125000,
          totalOrders: 1890,
          totalCustomers: 567,
          totalMedicines: 89,
          averageOrderValue: 66.14,
          period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          growth: {
            sales: 12.5,
            orders: 8.3,
            customers: 15.2
          }
        },
        medicines: [
          {
            id: 1,
            name: 'Paracetamol 500mg',
            category: 'Tablets',
            quantitySold: 450,
            revenue: 8995.50,
            avgPrice: 19.99,
            seller: 'PharmaCorp'
          },
          {
            id: 2,
            name: 'Vitamin D3 Capsules',
            category: 'Supplements',
            quantitySold: 320,
            revenue: 7996.80,
            avgPrice: 24.99,
            seller: 'HealthPlus'
          },
          {
            id: 3,
            name: 'Cough Syrup 100ml',
            category: 'Syrups',
            quantitySold: 280,
            revenue: 3637.20,
            avgPrice: 12.99,
            seller: 'MediCare'
          },
          {
            id: 4,
            name: 'Antibiotic Capsules',
            category: 'Capsules',
            quantitySold: 150,
            revenue: 5248.50,
            avgPrice: 34.99,
            seller: 'BioMed'
          },
          {
            id: 5,
            name: 'Insulin Pen',
            category: 'Injections',
            quantitySold: 89,
            revenue: 6229.11,
            avgPrice: 69.99,
            seller: 'DiabetCare'
          }
        ],
        sellers: [
          {
            id: 1,
            name: 'PharmaCorp',
            totalSales: 25600.50,
            totalOrders: 234,
            totalMedicines: 12,
            averageOrderValue: 109.40,
            commission: 2560.05
          },
          {
            id: 2,
            name: 'HealthPlus',
            totalSales: 18750.25,
            totalOrders: 189,
            totalMedicines: 8,
            averageOrderValue: 99.21,
            commission: 1875.03
          },
          {
            id: 3,
            name: 'MediCare',
            totalSales: 15430.75,
            totalOrders: 167,
            totalMedicines: 15,
            averageOrderValue: 92.40,
            commission: 1543.08
          },
          {
            id: 4,
            name: 'BioMed',
            totalSales: 12890.40,
            totalOrders: 145,
            totalMedicines: 6,
            averageOrderValue: 88.90,
            commission: 1289.04
          }
        ],
        customers: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            totalSpent: 1245.60,
            totalOrders: 8,
            averageOrderValue: 155.70,
            lastOrderDate: '2024-01-15'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            totalSpent: 956.80,
            totalOrders: 6,
            averageOrderValue: 159.47,
            lastOrderDate: '2024-01-14'
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            totalSpent: 743.25,
            totalOrders: 5,
            averageOrderValue: 148.65,
            lastOrderDate: '2024-01-13'
          }
        ],
        dailySales: [
          { date: '2024-01-01', sales: 3200, orders: 24 },
          { date: '2024-01-02', sales: 2800, orders: 21 },
          { date: '2024-01-03', sales: 4100, orders: 29 },
          { date: '2024-01-04', sales: 3600, orders: 26 },
          { date: '2024-01-05', sales: 4500, orders: 32 },
          { date: '2024-01-06', sales: 3900, orders: 28 },
          { date: '2024-01-07', sales: 4200, orders: 30 }
        ]
      };
      
      setReportData(mockReportData);
      toast.success('Sales report generated successfully!');
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate sales report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const exportReport = async (format) => {
    if (!reportData) {
      toast.error('Please generate a report first.');
      return;
    }
    
    setIsExportingReport(true);
    try {
      // In real implementation, this would call the API to generate and download the file
      // const response = await fetch(`/api/admin/reports/export?format=${format}&type=${reportType}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reportData, dateRange: reportDateRange })
      // });
      
      // Mock implementation - would normally trigger a file download
      const filename = `sales-report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
      
      // Create mock content for demonstration
      let content = '';
      if (format === 'csv') {
        switch (reportType) {
          case 'medicines':
            content = 'Medicine Name,Category,Quantity Sold,Revenue,Average Price,Seller\n';
            reportData.medicines.forEach(medicine => {
              content += `"${medicine.name}","${medicine.category}",${medicine.quantitySold},${medicine.revenue},${medicine.avgPrice},"${medicine.seller}"\n`;
            });
            break;
          case 'sellers':
            content = 'Seller Name,Total Sales,Total Orders,Total Medicines,Average Order Value,Commission\n';
            reportData.sellers.forEach(seller => {
              content += `"${seller.name}",${seller.totalSales},${seller.totalOrders},${seller.totalMedicines},${seller.averageOrderValue},${seller.commission}\n`;
            });
            break;
          case 'customers':
            content = 'Customer Name,Email,Total Spent,Total Orders,Average Order Value,Last Order Date\n';
            reportData.customers.forEach(customer => {
              content += `"${customer.name}","${customer.email}",${customer.totalSpent},${customer.totalOrders},${customer.averageOrderValue},"${customer.lastOrderDate}"\n`;
            });
            break;
          default:
            content = 'Metric,Value\n';
            content += `Total Sales,${reportData.overview.totalSales}\n`;
            content += `Total Orders,${reportData.overview.totalOrders}\n`;
            content += `Total Customers,${reportData.overview.totalCustomers}\n`;
            content += `Average Order Value,${reportData.overview.averageOrderValue}\n`;
        }
      }
      
      // Create and trigger download
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Report exported as ${format.toUpperCase()} successfully!`);
      
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report. Please try again.');
    } finally {
      setIsExportingReport(false);
    }
  };

  const getReportPeriodLabel = () => {
    switch (reportDateRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      case 'custom': return `${customStartDate} to ${customEndDate}`;
      default: return 'This Month';
    }
  };

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
        startDate: banner.startDate,
        endDate: banner.endDate
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        description: '',
        image: '',
        link: '',
        priority: 1,
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
      // In real implementation, this would call the API
      // const endpoint = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      // const method = editingBanner ? 'PUT' : 'POST';
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bannerForm)
      // });
      
      if (editingBanner) {
        // Update existing banner
        setBannerAds(prevBanners => 
          prevBanners.map(banner => 
            banner.id === editingBanner.id 
              ? { 
                  ...banner, 
                  ...bannerForm, 
                  updatedAt: new Date().toISOString() 
                }
              : banner
          )
        );
        toast.success('Banner updated successfully!');
      } else {
        // Add new banner
        const newBanner = {
          id: Date.now(),
          ...bannerForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          clicks: 0
        };
        setBannerAds(prevBanners => [...prevBanners, newBanner]);
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

  const deleteBanner = (bannerId) => {
    const banner = bannerAds.find(b => b.id === bannerId);
    if (window.confirm(`Are you sure you want to delete "${banner?.title}"?`)) {
      setBannerAds(prevBanners => prevBanners.filter(b => b.id !== bannerId));
      toast.success('Banner deleted successfully!');
    }
  };

  const toggleBannerStatus = async (bannerId) => {
    try {
      // In real implementation, this would call the API
      // await fetch(`/api/admin/banners/${bannerId}/toggle`, { method: 'PATCH' });
      
      setBannerAds(prevBanners => 
        prevBanners.map(banner => 
          banner.id === bannerId 
            ? { ...banner, isActive: !banner.isActive }
            : banner
        )
      );
      
      const banner = bannerAds.find(b => b.id === bannerId);
      toast.success(`Banner ${banner?.isActive ? 'deactivated' : 'activated'} successfully!`);
      
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status.');
    }
  };

  const changeBannerPriority = async (bannerId, newPriority) => {
    try {
      // In real implementation, this would call the API
      // await fetch(`/api/admin/banners/${bannerId}/priority`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priority: newPriority })
      // });
      
      setBannerAds(prevBanners => 
        prevBanners.map(banner => 
          banner.id === bannerId 
            ? { ...banner, priority: newPriority }
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
      (bannerStatusFilter === 'active' && banner.isActive) ||
      (bannerStatusFilter === 'inactive' && !banner.isActive);
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)

  const getBannerStatusColor = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (!isActive) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
    }
    
    if (start && now < start) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    }
    
    if (end && now > end) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    }
    
    return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
  };

  const getBannerStatusText = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (!isActive) return 'Inactive';
    if (start && now < start) return 'Scheduled';
    if (end && now > end) return 'Expired';
    return 'Active';
  };

  return (
    <>
      <style>{`
        .tab-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .tab-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .tab-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        .tab-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        @media (max-width: 640px) {
          .tab-scroll::-webkit-scrollbar {
            height: 2px;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage your CureBay platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="w-full overflow-x-auto pb-2 tab-scroll">
            <TabsList className="flex h-10 items-center gap-1 rounded-md bg-muted p-1 text-muted-foreground" style={{ minWidth: 'max-content' }}>
              <TabsTrigger value="overview" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Users
              </TabsTrigger>
              <TabsTrigger value="categories" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Categories
              </TabsTrigger>
              <TabsTrigger value="payments" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Payments
              </TabsTrigger>
              <TabsTrigger value="reports" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Reports
              </TabsTrigger>
              <TabsTrigger value="banners" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Banners
              </TabsTrigger>
              <TabsTrigger value="hero-slides" className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-sm">
                Hero Slides
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {Array.isArray(recentUsers) && recentUsers.map((user) => (
                      <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{user.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge variant={user.role === 'seller' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                            {user.role}
                          </Badge>
                          <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
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
                  <CardTitle className="text-lg sm:text-xl">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {(!pendingPayments || pendingPayments.length === 0) && (
                      <div className="text-gray-400 text-center py-8 text-sm sm:text-base">No pending payments.</div>
                    )}
                    {Array.isArray(pendingPayments) && pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base">Order #{payment.id}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {payment.customer} ({payment.email})
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{payment.date ? new Date(payment.date).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-base">${payment.amount}</p>
                          <Button size="sm" className="mt-1 w-full sm:w-auto" onClick={() => acceptPayment(payment.id)}>
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
          <TabsContent value="categories" className="space-y-4 sm:space-y-6">
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
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Management
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Monitor and manage payment transactions</p>
              </div>
              
              {/* Bulk Actions */}
              {selectedPayments.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBulkPaymentAction('accept')}
                    disabled={isProcessingPayment}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Accept ({selectedPayments.size})
                  </Button>
                  <Button
                    onClick={() => handleBulkPaymentAction('reject')}
                    disabled={isProcessingPayment}
                    variant="destructive"
                    size="sm"
                  >
                    Reject ({selectedPayments.size})
                  </Button>
                  <Button
                    onClick={clearPaymentSelection}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search payments..."
                      value={paymentSearch}
                      onChange={(e) => setPaymentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Date Filter */}
                  <Select value={paymentDateFilter} onValueChange={setPaymentDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={selectAllPayments}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Select Pending
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {filteredPayments.filter(p => p.status === 'pending').length}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Payments</p>
                      <p className="text-2xl font-bold text-green-600">
                        {filteredPayments.filter(p => p.status === 'accepted').length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Payments</p>
                      <p className="text-2xl font-bold text-red-600">
                        {filteredPayments.filter(p => p.status === 'rejected').length}
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Payments ({filteredPayments.length})</span>
                  {selectedPayments.size > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      {selectedPayments.size} selected
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedPayments.size === filteredPayments.filter(p => p.status === 'pending').length && filteredPayments.filter(p => p.status === 'pending').length > 0}
                            onChange={selectedPayments.size > 0 ? clearPaymentSelection : selectAllPayments}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Payment Details</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Customer</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Method</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Date</th>
                        <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedPayments.has(payment.id)}
                              onChange={() => togglePaymentSelection(payment.id)}
                              disabled={payment.status !== 'pending'}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{payment.id}</p>
                              <p className="text-sm text-gray-500">Order: {payment.orderId}</p>
                              {payment.paymentDetails.transactionId && (
                                <p className="text-xs text-gray-400">TXN: {payment.paymentDetails.transactionId}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{payment.customerName}</p>
                              <p className="text-sm text-gray-500">{payment.customerEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-lg text-blue-600">${payment.amount.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">
                                {payment.medicines.length} item{payment.medicines.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="text-sm">{payment.paymentMethod}</span>
                            </div>
                            {payment.paymentDetails.cardLast4 && (
                              <p className="text-xs text-gray-400">****{payment.paymentDetails.cardLast4}</p>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                            {payment.status === 'rejected' && payment.rejectReason && (
                              <p className="text-xs text-red-600 mt-1 max-w-32 truncate" title={payment.rejectReason}>
                                {payment.rejectReason}
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleTimeString()}</p>
                              {payment.acceptedAt && (
                                <p className="text-xs text-green-600">Accepted: {new Date(payment.acceptedAt).toLocaleDateString()}</p>
                              )}
                              {payment.rejectedAt && (
                                <p className="text-xs text-red-600">Rejected: {new Date(payment.rejectedAt).toLocaleDateString()}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {payment.status === 'pending' && (
                                <>
                                  <Button
                                    onClick={() => openPaymentModal(payment, 'accept')}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => openPaymentModal(payment, 'reject')}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Payment Details - {payment.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Customer Information</Label>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1">
                                          <p className="font-medium">{payment.customerName}</p>
                                          <p className="text-sm text-gray-600">{payment.customerEmail}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Payment Information</Label>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1">
                                          <p className="font-medium">${payment.amount.toFixed(2)}</p>
                                          <p className="text-sm text-gray-600">{payment.paymentMethod}</p>
                                          <Badge className={getStatusColor(payment.status)}>
                                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-sm font-medium">Medicines Ordered</Label>
                                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1 space-y-2">
                                        {payment.medicines.map((medicine, index) => (
                                          <div key={index} className="flex justify-between items-center">
                                            <div>
                                              <p className="font-medium">{medicine.name}</p>
                                              <p className="text-sm text-gray-600">Quantity: {medicine.quantity}</p>
                                            </div>
                                            <p className="font-medium">${(medicine.price * medicine.quantity).toFixed(2)}</p>
                                          </div>
                                        ))}
                                        <div className="border-t pt-2 mt-2">
                                          <div className="flex justify-between items-center font-bold">
                                            <span>Total</span>
                                            <span>${payment.amount.toFixed(2)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {payment.rejectReason && (
                                      <div>
                                        <Label className="text-sm font-medium text-red-600">Rejection Reason</Label>
                                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-1">
                                          <p className="text-red-700 dark:text-red-300">{payment.rejectReason}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No payments found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {paymentSearch || paymentStatusFilter !== 'all' || paymentDateFilter !== 'all'
                        ? 'Try adjusting your search and filters.'
                        : 'Payments will appear here when customers make purchases.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Action Modal */}
            <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {paymentAction === 'accept' ? 'Accept Payment' : 'Reject Payment'}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedPayment && (
                      <span>
                        Payment ID: {selectedPayment.id} - ${selectedPayment.amount.toFixed(2)}
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {selectedPayment && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedPayment.customerName}</p>
                          <p className="text-sm text-gray-600">{selectedPayment.customerEmail}</p>
                          <p className="text-xs text-gray-500">Order: {selectedPayment.orderId}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentAction === 'reject' && (
                    <div>
                      <Label htmlFor="reject-reason">Rejection Reason</Label>
                      <Textarea
                        id="reject-reason"
                        placeholder="Please provide a reason for rejecting this payment..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-medium">Confirm Action</p>
                        <p>
                          {paymentAction === 'accept'
                            ? 'This will approve the payment and notify the customer.'
                            : 'This will reject the payment and notify the customer with the reason provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPaymentModalOpen(false)}
                    disabled={isProcessingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={processPayment}
                    disabled={isProcessingPayment || (paymentAction === 'reject' && !rejectReason.trim())}
                    className={paymentAction === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      paymentAction === 'accept' ? 'Accept Payment' : 'Reject Payment'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Sales Reports
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Generate comprehensive sales analytics and reports</p>
              </div>
              
              {reportData && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportReport('csv')}
                    disabled={isExportingReport}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => exportReport('pdf')}
                    disabled={isExportingReport}
                    variant="outline"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              )}
            </div>

            {/* Report Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Report Type */}
                  <div>
                    <Label>Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="medicines">Medicine Sales</SelectItem>
                        <SelectItem value="sellers">Seller Performance</SelectItem>
                        <SelectItem value="customers">Customer Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Date Range */}
                  <div>
                    <Label>Date Range</Label>
                    <Select value={reportDateRange} onValueChange={setReportDateRange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Custom Date Range */}
                  {reportDateRange === 'custom' && (
                    <>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={generateSalesReport}
                    disabled={isGeneratingReport || (reportDateRange === 'custom' && (!customStartDate || !customEndDate))}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingReport ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  
                  {reportData && (
                    <Button variant="outline" onClick={() => setReportData(null)}>
                      Clear Report
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Results */}
            {reportData && (
              <>
                {/* Overview Report */}
                {reportType === 'overview' && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Sales Overview - {getReportPeriodLabel()}</span>
                          <Badge variant="outline">{reportData.overview.period}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Total Sales</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                  ${reportData.overview.totalSales.toLocaleString()}
                                </p>
                                <p className="text-xs text-blue-600 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  +{reportData.overview.growth.sales}%
                                </p>
                              </div>
                              <DollarSign className="w-8 h-8 text-blue-600" />
                            </div>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-green-600 dark:text-green-400">Total Orders</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                  {reportData.overview.totalOrders.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  +{reportData.overview.growth.orders}%
                                </p>
                              </div>
                              <ShoppingBag className="w-8 h-8 text-green-600" />
                            </div>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Total Customers</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                  {reportData.overview.totalCustomers.toLocaleString()}
                                </p>
                                <p className="text-xs text-purple-600 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  +{reportData.overview.growth.customers}%
                                </p>
                              </div>
                              <Users className="w-8 h-8 text-purple-600" />
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-orange-600 dark:text-orange-400">Avg. Order Value</p>
                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                  ${reportData.overview.averageOrderValue.toFixed(2)}
                                </p>
                                <p className="text-xs text-orange-600">
                                  Per order
                                </p>
                              </div>
                              <TrendingUp className="w-8 h-8 text-orange-600" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Medicine Sales Report */}
                {reportType === 'medicines' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Medicine Sales Performance - {getReportPeriodLabel()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left p-3 font-medium">Medicine</th>
                              <th className="text-left p-3 font-medium">Category</th>
                              <th className="text-left p-3 font-medium">Quantity Sold</th>
                              <th className="text-left p-3 font-medium">Revenue</th>
                              <th className="text-left p-3 font-medium">Avg. Price</th>
                              <th className="text-left p-3 font-medium">Seller</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.medicines.map((medicine, index) => (
                              <tr key={medicine.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                    <span className="font-medium">{medicine.name}</span>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <Badge variant="outline">{medicine.category}</Badge>
                                </td>
                                <td className="p-3 font-medium">{medicine.quantitySold}</td>
                                <td className="p-3 font-bold text-green-600">${medicine.revenue.toFixed(2)}</td>
                                <td className="p-3">${medicine.avgPrice.toFixed(2)}</td>
                                <td className="p-3 text-gray-600">{medicine.seller}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Seller Performance Report */}
                {reportType === 'sellers' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Seller Performance - {getReportPeriodLabel()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left p-3 font-medium">Seller</th>
                              <th className="text-left p-3 font-medium">Total Sales</th>
                              <th className="text-left p-3 font-medium">Orders</th>
                              <th className="text-left p-3 font-medium">Medicines</th>
                              <th className="text-left p-3 font-medium">Avg. Order Value</th>
                              <th className="text-left p-3 font-medium">Commission</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.sellers.map((seller, index) => (
                              <tr key={seller.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                    <span className="font-medium">{seller.name}</span>
                                  </div>
                                </td>
                                <td className="p-3 font-bold text-green-600">${seller.totalSales.toFixed(2)}</td>
                                <td className="p-3">{seller.totalOrders}</td>
                                <td className="p-3">{seller.totalMedicines}</td>
                                <td className="p-3">${seller.averageOrderValue.toFixed(2)}</td>
                                <td className="p-3 font-medium text-blue-600">${seller.commission.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Customer Analytics Report */}
                {reportType === 'customers' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Analytics - {getReportPeriodLabel()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left p-3 font-medium">Customer</th>
                              <th className="text-left p-3 font-medium">Email</th>
                              <th className="text-left p-3 font-medium">Total Spent</th>
                              <th className="text-left p-3 font-medium">Orders</th>
                              <th className="text-left p-3 font-medium">Avg. Order Value</th>
                              <th className="text-left p-3 font-medium">Last Order</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.customers.map((customer, index) => (
                              <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                    <span className="font-medium">{customer.name}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-gray-600">{customer.email}</td>
                                <td className="p-3 font-bold text-green-600">${customer.totalSpent.toFixed(2)}</td>
                                <td className="p-3">{customer.totalOrders}</td>
                                <td className="p-3">${customer.averageOrderValue.toFixed(2)}</td>
                                <td className="p-3 text-sm">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Empty State */}
            {!reportData && (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Generate Sales Report
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select your report parameters above and click "Generate Report" to view comprehensive sales analytics.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Overview Reports</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Sales summary, growth metrics, and KPIs</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Medicine Analytics</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">Top-selling medicines and categories</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">Seller Performance</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Revenue and commission tracking</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-1">Customer Analytics</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">Customer spending and behavior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-6 h-6" />
                  Banner Advertisement Management
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage homepage banner advertisements and promotions</p>
              </div>
              
              <Button onClick={() => openBannerModal()} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
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
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Banner Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Banners</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {bannerAds.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Megaphone className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Banners</p>
                      <p className="text-2xl font-bold text-green-600">
                        {bannerAds.filter(b => b.isActive).length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Eye className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {bannerAds.reduce((sum, banner) => sum + banner.views, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {bannerAds.reduce((sum, banner) => sum + banner.clicks, 0).toLocaleString()}
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
            <Card>
              <CardHeader>
                <CardTitle>Banner Advertisements ({filteredBannerAds.length})</CardTitle>
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
                      <div key={banner.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Banner Preview */}
                          <div className="lg:w-1/3">
                            <div className="relative group">
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Banner Details */}
                          <div className="lg:w-2/3 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {banner.title}
                                  </h3>
                                  <Badge className={getBannerStatusColor(banner.isActive, banner.startDate, banner.endDate)}>
                                    {getBannerStatusText(banner.isActive, banner.startDate, banner.endDate)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Priority: {banner.priority}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                  {banner.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <span>Link: {banner.link}</span>
                                  <span>•</span>
                                  <span>Views: {banner.views.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>Clicks: {banner.clicks.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(2) : 0}%</span>
                                </div>
                                {(banner.startDate || banner.endDate) && (
                                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                    {banner.startDate && <span>Start: {new Date(banner.startDate).toLocaleDateString()}</span>}
                                    {banner.endDate && <span>End: {new Date(banner.endDate).toLocaleDateString()}</span>}
                                  </div>
                                )}
                              </div>
                              
                              {/* Actions */}
                              <div className="flex flex-col gap-2 min-w-0 sm:min-w-[200px]">
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => openBannerModal(banner)}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => deleteBanner(banner.id)}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                <Button
                                  onClick={() => toggleBannerStatus(banner.id)}
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
                                  <Label className="text-xs">Priority:</Label>
                                  <Select 
                                    value={banner.priority.toString()} 
                                    onValueChange={(value) => changeBannerPriority(banner.id, parseInt(value))}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
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
                          <SelectItem value="3">3</SelectItem>
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
                      className="rounded border-gray-300"
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
          </TabsContent>

          {/* Hero Slides Tab */}
          <TabsContent value="hero-slides">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Manage Hero Slides
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Control homepage hero slider content</p>
                  </div>
                  <Button onClick={() => openHeroSlideModal()} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Hero Slide
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
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
                  <div className="space-y-4">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Slide Preview */}
                          <div className="lg:w-1/3">
                            <div 
                              className={`relative h-32 rounded-lg bg-gradient-to-r ${slide.backgroundColor} overflow-hidden`}
                              style={{
                                backgroundImage: slide.image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})` : '',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            >
                              <div className="absolute inset-0 p-3 text-white">
                                <h3 className="text-sm font-bold truncate">{slide.title}</h3>
                                <p className="text-xs opacity-90 truncate">{slide.subtitle}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Slide Details */}
                          <div className="lg:w-2/3 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{slide.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{slide.subtitle}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={slide.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}>
                                  {slide.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {slide.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Button: "{slide.buttonText}"</span>
                              <span>•</span>
                              <span>Link: {slide.buttonLink}</span>
                              <span>•</span>
                              <span>Created: {new Date(slide.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openHeroSlideModal(slide)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleHeroSlideStatus(slide.id)}
                                className={`flex items-center gap-1 ${
                                  slide.isActive 
                                    ? 'text-red-600 hover:text-red-700 border-red-200 hover:border-red-300' 
                                    : 'text-green-600 hover:text-green-700 border-green-200 hover:border-green-300'
                                }`}
                              >
                                <RotateCcw className="w-3 h-3" />
                                {slide.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteHeroSlide(slide.id)}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Hero Slide Modal */}
            <Dialog open={heroSlideModalOpen} onOpenChange={setHeroSlideModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingHeroSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </DialogTitle>
                  <DialogDescription>
                    Create engaging hero slides to showcase on your homepage
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="slide-title">Title *</Label>
                      <Input
                        id="slide-title"
                        placeholder="Quality Healthcare Solutions"
                        value={heroSlideForm.title}
                        onChange={(e) => setHeroSlideForm({...heroSlideForm, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slide-subtitle">Subtitle</Label>
                      <Input
                        id="slide-subtitle"
                        placeholder="Your trusted partner for medical needs"
                        value={heroSlideForm.subtitle}
                        onChange={(e) => setHeroSlideForm({...heroSlideForm, subtitle: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="slide-description">Description</Label>
                    <Textarea
                      id="slide-description"
                      placeholder="Discover our comprehensive range of medicines and healthcare products..."
                      value={heroSlideForm.description}
                      onChange={(e) => setHeroSlideForm({...heroSlideForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slide-image">Background Image URL</Label>
                    <Input
                      id="slide-image"
                      placeholder="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f"
                      value={heroSlideForm.image}
                      onChange={(e) => setHeroSlideForm({...heroSlideForm, image: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="slide-button-text">Button Text</Label>
                      <Input
                        id="slide-button-text"
                        placeholder="Shop Now"
                        value={heroSlideForm.buttonText}
                        onChange={(e) => setHeroSlideForm({...heroSlideForm, buttonText: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slide-button-link">Button Link</Label>
                      <Input
                        id="slide-button-link"
                        placeholder="/shop"
                        value={heroSlideForm.buttonLink}
                        onChange={(e) => setHeroSlideForm({...heroSlideForm, buttonLink: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="slide-background">Background Gradient</Label>
                      <Select 
                        value={heroSlideForm.backgroundColor} 
                        onValueChange={(value) => setHeroSlideForm({...heroSlideForm, backgroundColor: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="from-blue-600 to-blue-800">Blue Gradient</SelectItem>
                          <SelectItem value="from-green-600 to-green-800">Green Gradient</SelectItem>
                          <SelectItem value="from-purple-600 to-purple-800">Purple Gradient</SelectItem>
                          <SelectItem value="from-red-600 to-red-800">Red Gradient</SelectItem>
                          <SelectItem value="from-orange-600 to-orange-800">Orange Gradient</SelectItem>
                          <SelectItem value="from-gray-600 to-gray-800">Gray Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="slide-text-color">Text Color</Label>
                      <Select 
                        value={heroSlideForm.textColor} 
                        onValueChange={(value) => setHeroSlideForm({...heroSlideForm, textColor: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-white">White Text</SelectItem>
                          <SelectItem value="text-black">Black Text</SelectItem>
                          <SelectItem value="text-gray-900">Dark Gray Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="slide-active"
                      checked={heroSlideForm.isActive}
                      onChange={(e) => setHeroSlideForm({...heroSlideForm, isActive: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="slide-active">Active (show on homepage)</Label>
                  </div>
                  
                  {/* Preview */}
                  {heroSlideForm.title && (
                    <div>
                      <Label>Preview</Label>
                      <div 
                        className={`relative h-24 rounded-lg bg-gradient-to-r ${heroSlideForm.backgroundColor} overflow-hidden mt-2`}
                        style={{
                          backgroundImage: heroSlideForm.image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroSlideForm.image})` : '',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className={`absolute inset-0 p-3 ${heroSlideForm.textColor}`}>
                          <h3 className="text-sm font-bold truncate">{heroSlideForm.title}</h3>
                          <p className="text-xs opacity-90 truncate">{heroSlideForm.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setHeroSlideModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveHeroSlide} disabled={!heroSlideForm.title}>
                    {editingHeroSlide ? 'Update Slide' : 'Add Slide'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;

