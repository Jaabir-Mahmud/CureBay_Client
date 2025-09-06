import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckIcon,
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
import { auth } from '../../../services/firebase';
import toast from 'react-hot-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import ManageUsers from '../../../components/dashboard/admin/ManageUsers';
import OverviewTab from '../../../components/dashboard/admin/OverviewTab';
import CategoriesTab from '../../../components/dashboard/admin/CategoriesTab';
import PaymentsTab from '../../../components/dashboard/admin/PaymentsTab';
import ReportsTab from '../../../components/dashboard/admin/ReportsTab';
import MarketingTab from '../../../components/dashboard/admin/MarketingTab';
import BannersTab from '../../../components/dashboard/admin/BannersTab';
import HeroSlidesTab from '../../../components/dashboard/admin/HeroSlidesTab';

function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'overview';
  });
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const { user: firebaseUser } = useAuth(); // Add this line to get the firebase user
  
  // Categories state
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Tablets', 
      count: 2450, 
      description: 'Oral solid dosage forms for various medical conditions',
      icon: 'Pill',
      color: 'cyan',
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
  
  // Hero Slides state
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSlideForm, setHeroSlideForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    backgroundColor: 'from-cyan-600 to-cyan-800',
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
    color: 'cyan'
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

  // Create a helper function to fetch data with authentication
  const fetchDataWithAuth = async (url) => {
    try {
      if (!firebaseUser) {
        // Try to get current user from auth state
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No user logged in');
        }
        // Use current user if firebaseUser context is not yet updated
        const token = await currentUser.getIdToken(true); // Force refresh token
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        return await res.json();
      }
      
      // Normal flow with firebaseUser from context
      const token = await firebaseUser.getIdToken(true); // Force refresh token
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      return await res.json();
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      throw err;
    }
  };

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

    // Fetch data with authentication
    const fetchData = async () => {
      try {
        // Fetch overview data
        const overviewData = await fetchDataWithAuth('/api/admin/overview');
        setStats(overviewData);
      } catch (err) {
        console.error('Error fetching overview:', err);
        // Keep default stats if API fails
      }

      try {
        // Fetch recent users
        const usersData = await fetchDataWithAuth('/api/admin/recent-users');
        setRecentUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error('Error fetching recent users:', err);
        setRecentUsers([]);
      }

      try {
        // Fetch pending payments
        const paymentsData = await fetchDataWithAuth('/api/admin/pending-payments');
        setPendingPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error('Error fetching pending payments:', err);
        setPendingPayments([]);
      }

      // Fetch categories from backend (no auth required for this endpoint)
      fetch('/api/categories')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Categories fetched from backend:', data);
          if (Array.isArray(data) && data.length > 0) {
            // Transform backend categories to match frontend format
            const transformedCategories = data.map(category => ({
              id: category._id,
              name: category.name,
              description: category.description,
              icon: category.icon || 'Pill', // Use default icon if not provided
              color: category.color || 'cyan', // Use default color if not provided
              status: category.isActive ? 'active' : 'inactive',
              createdAt: category.createdAt,
              count: category.count || 0
            }));
            console.log('Transformed categories:', transformedCategories);
            setCategories(transformedCategories);
          } else {
            console.log('No categories found in backend, using default categories');
            // Keep default categories if API returns empty array
            toast.error('No categories found in database. Using default data.', {
              duration: 4000,
              position: 'top-right',
            });
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
      try {
        const paymentsData = await fetchDataWithAuth('/api/admin/payments');
        if (Array.isArray(paymentsData)) {
          setPayments(paymentsData);
        }
      } catch (err) {
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
      }

      // Fetch hero slides from backend (no auth required for this endpoint)
      fetch('/api/hero-slides')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            // Convert _id to id for frontend compatibility
            const slidesWithId = data.map(slide => ({
              ...slide,
              id: slide._id
            }));
            setHeroSlides(slidesWithId);
          }
        })
        .catch(err => {
          console.error('Error fetching hero slides:', err);
          // Initialize with empty array if API fails
          setHeroSlides([]);
          toast.error('Failed to load hero slides from server.', {
            duration: 4000,
            position: 'top-right',
          });
        });

      // Fetch banners from backend (no auth required for this endpoint)
      fetch('/api/banners')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            // Convert _id to id for frontend compatibility
            const bannersWithId = data.map(banner => ({
              ...banner,
              id: banner._id
            }));
            setBannerAds(bannersWithId);
          }
        })
        .catch(err => {
          console.error('Error fetching banners:', err);
          // Initialize with empty array if API fails
          setBannerAds([]);
          toast.error('Failed to load banners from server.', {
            duration: 4000,
            position: 'top-right',
          });
        });
    };

    fetchData();
  }, [firebaseUser]);

  const acceptPayment = async (orderId) => {
    try {
      if (!firebaseUser) {
        throw new Error('No user logged in');
      }
      
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`/api/admin/accept-payment/${orderId}`, { 
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      if (!res.ok) throw new Error('Failed to accept payment');
      setPendingPayments(payments => payments.filter(p => p.id !== orderId));
      // Optionally, refetch stats to update paid/pending totals
      try {
        const overviewData = await fetchDataWithAuth('/api/admin/overview');
        setStats(overviewData);
      } catch (err) {
        console.error('Error refetching overview:', err);
      }
    } catch (err) {
      console.error('Error accepting payment:', err);
      toast.error('Failed to accept payment: ' + err.message);
    }
  };

  if (!stats) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
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
      cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        text: 'text-cyan-600 dark:text-cyan-400',
        border: 'border-cyan-200 dark:border-cyan-800',
        icon: 'bg-cyan-100 dark:bg-cyan-800'
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
  };

  const viewCategoryMedicines = (category) => {
    // Preserve current tab in the URL for proper back navigation
    navigate(`/dashboard/admin/categories/${category._id || category.id}/medicines?fromTab=${activeTab}`);
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
          // For default categories, create a new one instead of updating
          res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
            },
            body: JSON.stringify(categoryForm),
          });
        } else {
          // Update existing category
          res = await fetch(`/api/categories/${editingCategory._id || editingCategory.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
            },
            body: JSON.stringify(categoryForm),
          });
        }
      } else {
        // Create new category
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
          },
          body: JSON.stringify(categoryForm),
        });
      }
      
      if (!res.ok) throw new Error('Failed to save category');
      
      const savedCategory = await res.json();
      
      if (editingCategory) {
        // Update existing category in state
        setCategories(categories => 
          categories.map(cat => 
            cat._id === (editingCategory._id || editingCategory.id) ? savedCategory : cat
          )
        );
        toast.success('Category updated successfully');
      } else {
        // Add new category to state
        setCategories(categories => [...categories, savedCategory]);
        toast.success('Category created successfully');
      }
      
      closeCategoryModal();
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error('Failed to save category: ' + err.message);
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
    if (!categoryToDelete || isDeletingCategory) return;
    
    setIsDeletingCategory(true);
    try {
      const res = await fetch(`/api/categories/${categoryToDelete._id || categoryToDelete.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete category');
      
      setCategories(categories => categories.filter(cat => cat._id !== categoryToDelete._id));
      toast.success('Category deleted successfully');
      closeDeleteCategoryModal();
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category: ' + err.message);
    } finally {
      setIsDeletingCategory(false);
    }
  };

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
        backgroundColor: 'from-cyan-600 to-cyan-800',
        textColor: 'text-white',
        isActive: true
      });
    }
    setHeroSlideModalOpen(true);
  };

  const saveHeroSlide = async () => {
    try {
      // Validate required fields
      if (!heroSlideForm.title || !heroSlideForm.image) {
        toast.error('Title and image are required');
        return;
      }

      // Get Firebase token for authentication
      const token = await firebaseUser.getIdToken();

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

  // Add close hero slide modal function
  const closeHeroSlideModal = () => {
    setHeroSlideModalOpen(false);
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
      isActive: true
    });
  };

  const deleteHeroSlide = async (slideId) => {
    const slide = heroSlides.find(s => s._id === slideId || s.id === slideId);
    if (window.confirm(`Are you sure you want to delete "${slide?.title}"?`)) {
      try {
        // Get Firebase token for authentication
        const token = await firebaseUser.getIdToken();
        
        const response = await fetch(`/api/hero-slides/${slideId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  // Add toggle hero slide status function
  const toggleHeroSlideStatus = async (slideId) => {
    try {
      // Get Firebase token for authentication
      const token = await firebaseUser.getIdToken();
      
      const response = await fetch(`/api/hero-slides/${slideId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      
      toast.success(`Hero slide ${updatedSlide.active ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling hero slide status:', error);
      toast.error(`Failed to toggle hero slide status: ${error.message}`);
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
    
    try {
      // Get Firebase token for authentication
      const token = await firebaseUser.getIdToken();
      
      if (editingBanner) {
        // Update existing banner
        const response = await fetch(`/api/banners/${editingBanner._id || editingBanner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            'Authorization': `Bearer ${token}`
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
    }
  };

  // Add close banner modal function
  const closeBannerModal = () => {
    setBannerModalOpen(false);
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
  };

  const deleteBanner = async (bannerId) => {
    const banner = bannerAds.find(b => b._id === bannerId || b.id === bannerId);
    if (window.confirm(`Are you sure you want to delete "${banner?.title}"?`)) {
      try {
        // Get Firebase token for authentication
        const token = await firebaseUser.getIdToken();
        
        const response = await fetch(`/api/banners/${bannerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  // Add toggle banner status function
  const toggleBannerStatus = async (bannerId) => {
    try {
      // Get Firebase token for authentication
      const token = await firebaseUser.getIdToken();
      
      const response = await fetch(`/api/banners/${bannerId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      
      toast.success(`Banner ${updatedBanner.active ? 'activated' : 'deactivated'} successfully!`);
      
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status.');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                         payment.customerEmail?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                         payment.orderId?.toLowerCase().includes(paymentSearch.toLowerCase());
    
    const matchesStatus = paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;
    
    // Date filtering
    let matchesDate = true;
    if (paymentDateFilter !== 'all' && payment.createdAt) {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      
      switch (paymentDateFilter) {
        case 'today':
          matchesDate = paymentDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = paymentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = paymentDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const togglePaymentSelection = (paymentId) => {
    const newSelected = new Set(selectedPayments);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelectedPayments(newSelected);
  };

  const selectAllPayments = () => {
    if (selectedPayments.size === filteredPayments.length) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(filteredPayments.map(p => p.id)));
    }
  };

  const processSelectedPayments = async (action) => {
    if (selectedPayments.size === 0) {
      toast.error('Please select at least one payment');
      return;
    }
    
    setIsProcessingPayment(true);
    try {
      const token = await firebaseUser.getIdToken();
      
      // Process each selected payment
      const results = await Promise.allSettled(
        Array.from(selectedPayments).map(paymentId => {
          if (action === 'accept') {
            return fetch(`/api/admin/accept-payment/${paymentId}`, {
              method: 'PATCH',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              }
            });
          } else if (action === 'reject') {
            return fetch(`/api/admin/reject-payment/${paymentId}`, {
              method: 'PATCH',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ reason: rejectReason })
            });
          }
        })
      );
      
      // Count successful operations
      const successful = results.filter(result => result.status === 'fulfilled' && result.value?.ok).length;
      const failed = results.length - successful;
      
      if (successful > 0) {
        toast.success(`${successful} payment(s) ${action}ed successfully`);
        // Refresh payments list
        const paymentsData = await fetchDataWithAuth('/api/admin/payments');
        if (Array.isArray(paymentsData)) {
          setPayments(paymentsData);
        }
        // Refresh stats
        try {
          const overviewData = await fetchDataWithAuth('/api/admin/overview');
          setStats(overviewData);
        } catch (err) {
          console.error('Error refetching overview:', err);
        }
      }
      
      if (failed > 0) {
        toast.error(`${failed} payment(s) failed to ${action}`);
      }
      
      // Clear selection
      setSelectedPayments(new Set());
      setRejectReason('');
    } catch (err) {
      console.error(`Error ${action}ing payments:`, err);
      toast.error(`Failed to ${action} payments: ` + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const exportReport = async () => {
    setIsExportingReport(true);
    try {
      // In a real app, this would call an API endpoint to generate and download the report
      toast.success('Report exported successfully');
    } catch (err) {
      console.error('Error exporting report:', err);
      toast.error('Failed to export report: ' + err.message);
    } finally {
      setIsExportingReport(false);
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // In a real app, this would call an API endpoint to generate the report data
      toast.success('Report generated successfully');
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate report: ' + err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your pharmacy store and monitor business performance</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Marketing</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab 
              stats={stats} 
              recentUsers={recentUsers} 
              pendingPayments={pendingPayments} 
              acceptPayment={acceptPayment} 
            />
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
          <TabsContent value="categories">
            <CategoriesTab 
              categories={categories}
              setCategories={setCategories}
              activeTab={activeTab}
            />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentsTab 
              payments={payments}
              paymentSearch={paymentSearch}
              setPaymentSearch={setPaymentSearch}
              paymentStatusFilter={paymentStatusFilter}
              setPaymentStatusFilter={setPaymentStatusFilter}
              paymentDateFilter={paymentDateFilter}
              setPaymentDateFilter={setPaymentDateFilter}
              selectedPayments={selectedPayments}
              setSelectedPayments={setSelectedPayments}
              filteredPayments={filteredPayments}
              togglePaymentSelection={togglePaymentSelection}
              selectAllPayments={selectAllPayments}
              processSelectedPayments={processSelectedPayments}
              isProcessingPayment={isProcessingPayment}
              paymentModalOpen={paymentModalOpen}
              setPaymentModalOpen={setPaymentModalOpen}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              paymentAction={paymentAction}
              setPaymentAction={setPaymentAction}
              rejectReason={rejectReason}
              setRejectReason={setRejectReason}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportsTab 
              reportType={reportType}
              setReportType={setReportType}
              reportDateRange={reportDateRange}
              setReportDateRange={setReportDateRange}
              customStartDate={customStartDate}
              setCustomStartDate={setCustomStartDate}
              customEndDate={customEndDate}
              setCustomEndDate={setCustomEndDate}
              generateReport={generateReport}
              isGeneratingReport={isGeneratingReport}
              exportReport={exportReport}
              isExportingReport={isExportingReport}
            />
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <MarketingTab 
              heroSlides={heroSlides}
              bannerAds={bannerAds}
              openHeroSlideModal={openHeroSlideModal}
              openBannerModal={openBannerModal}
              deleteHeroSlide={deleteHeroSlide}
              deleteBanner={deleteBanner}
              toggleHeroSlideStatus={toggleHeroSlideStatus}
              toggleBannerStatus={toggleBannerStatus}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category details below' 
                : 'Fill in the details to create a new category'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                placeholder="e.g., Tablets, Syrups"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category-description">Description *</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                placeholder="Brief description of the category"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category-icon">Icon</Label>
                <Select 
                  value={categoryForm.icon} 
                  onValueChange={(value) => setCategoryForm({...categoryForm, icon: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pill">Pill</SelectItem>
                    <SelectItem value="Heart">Heart</SelectItem>
                    <SelectItem value="Circle">Circle</SelectItem>
                    <SelectItem value="Syringe">Syringe</SelectItem>
                    <SelectItem value="Stethoscope">Stethoscope</SelectItem>
                    <SelectItem value="Tag">Tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category-color">Color</Label>
                <Select 
                  value={categoryForm.color} 
                  onValueChange={(value) => setCategoryForm({...categoryForm, color: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={closeCategoryModal}>
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
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {categoryToDelete?.name || 'Unknown Category'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {categoryToDelete?.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                      {categoryToDelete?.count || 0} medicines
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${categoryToDelete?.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}`}>
                      {categoryToDelete?.status}
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
                    <li>• All medicines in this category will become uncategorized</li>
                    <li>• Associated products may not display properly</li>
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

      {/* Payment Action Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentAction === 'accept' ? 'Accept Payment' : 'Reject Payment'}
            </DialogTitle>
            <DialogDescription>
              {paymentAction === 'accept' 
                ? 'Confirm acceptance of this payment' 
                : 'Provide a reason for rejecting this payment'}
            </DialogDescription>
          </DialogHeader>
          
          {paymentAction === 'reject' && (
            <div className="py-4">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection"
                rows={3}
                required
              />
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (paymentAction === 'accept') {
                  await acceptPayment(selectedPayment?._id || selectedPayment?.id);
                } else {
                  // Handle rejection
                }
                setPaymentModalOpen(false);
              }}
            >
              {paymentAction === 'accept' ? 'Accept Payment' : 'Reject Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Slide Modal */}
      <Dialog open={heroSlideModalOpen} onOpenChange={closeHeroSlideModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHeroSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            </DialogTitle>
            <DialogDescription>
              {editingHeroSlide 
                ? 'Update the hero slide details below' 
                : 'Fill in the details to create a new hero slide'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="slide-title">Title *</Label>
              <Input
                id="slide-title"
                placeholder="e.g., Summer Health Sale"
                value={heroSlideForm.title}
                onChange={(e) => setHeroSlideForm({...heroSlideForm, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slide-subtitle">Subtitle</Label>
              <Input
                id="slide-subtitle"
                placeholder="e.g., Save up to 30% on vitamins"
                value={heroSlideForm.subtitle}
                onChange={(e) => setHeroSlideForm({...heroSlideForm, subtitle: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="slide-description">Description</Label>
              <Textarea
                id="slide-description"
                placeholder="Brief description of the promotion"
                value={heroSlideForm.description}
                onChange={(e) => setHeroSlideForm({...heroSlideForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="slide-image">Image URL</Label>
              <Input
                id="slide-image"
                placeholder="https://example.com/image.jpg"
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
                    <SelectItem value="from-cyan-600 to-cyan-800">Cyan Gradient</SelectItem>
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
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={closeHeroSlideModal}>
                Cancel
              </Button>
              <Button onClick={saveHeroSlide} disabled={!heroSlideForm.title}>
                {editingHeroSlide ? 'Update Slide' : 'Add Slide'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Banner Modal */}
      <Dialog open={bannerModalOpen} onOpenChange={closeBannerModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </DialogTitle>
            <DialogDescription>
              {editingBanner 
                ? 'Update the banner details below' 
                : 'Fill in the details to create a new banner advertisement'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="banner-title">Title *</Label>
              <Input
                id="banner-title"
                placeholder="e.g., Summer Health Sale"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="banner-description">Description</Label>
              <Textarea
                id="banner-description"
                placeholder="Brief description of the promotion"
                value={bannerForm.description}
                onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="banner-image">Image URL</Label>
              <Input
                id="banner-image"
                placeholder="https://example.com/image.jpg"
                value={bannerForm.image}
                onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="banner-link">Link URL</Label>
              <Input
                id="banner-link"
                placeholder="https://example.com/promotion"
                value={bannerForm.link}
                onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner-priority">Priority (1-10)</Label>
                <Input
                  id="banner-priority"
                  type="number"
                  min="1"
                  max="10"
                  value={bannerForm.priority}
                  onChange={(e) => setBannerForm({...bannerForm, priority: parseInt(e.target.value) || 1})}
                />
              </div>
              
              <div>
                <Label htmlFor="banner-active">Status</Label>
                <Select 
                  value={bannerForm.isActive ? 'active' : 'inactive'} 
                  onValueChange={(value) => setBannerForm({...bannerForm, isActive: value === 'active'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner-start-date">Start Date</Label>
                <Input
                  id="banner-start-date"
                  type="date"
                  value={bannerForm.startDate}
                  onChange={(e) => setBannerForm({...bannerForm, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="banner-end-date">End Date</Label>
                <Input
                  id="banner-end-date"
                  type="date"
                  value={bannerForm.endDate}
                  onChange={(e) => setBannerForm({...bannerForm, endDate: e.target.value})}
                />
              </div>
            </div>
            
            {/* Preview */}
            {(bannerForm.title || bannerForm.image) && (
              <div>
                <Label>Preview</Label>
                <Card className="mt-2">
                  <div className="flex gap-4 p-4">
                    {bannerForm.image ? (
                      <img 
                        src={bannerForm.image} 
                        alt={bannerForm.title} 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {bannerForm.title || 'Banner Title'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {bannerForm.description || 'Banner description will appear here'}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Priority: {bannerForm.priority}</span>
                        <span>•</span>
                        <span>Status: {bannerForm.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={closeBannerModal}>
                Cancel
              </Button>
              <Button onClick={saveBanner} disabled={!bannerForm.title}>
                {editingBanner ? 'Update Banner' : 'Add Banner'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;