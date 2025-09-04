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

// Import extracted components
import ManageUsers from '../../../components/dashboard/admin/ManageUsers';
import OverviewTab from '../../../components/dashboard/admin/OverviewTab';
import CategoriesTab from '../../../components/dashboard/admin/CategoriesTab';
import PaymentsTab from '../../../components/dashboard/admin/PaymentsTab';
import ReportsTab from '../../../components/dashboard/admin/ReportsTab';
import BannersTab from '../../../components/dashboard/admin/BannersTab';
import HeroSlidesTab from '../../../components/dashboard/admin/HeroSlidesTab';

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

    // Fetch hero slides from backend
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

    // Fetch banners from backend
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
      </div>
    </div>
  );

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
          <TabsContent value="categories" className="space-y-4 sm:space-y-6">
            <CategoriesTab 
              categories={categories}
              setCategories={setCategories}
              activeTab={activeTab}
            />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 sm:space-y-6">
            <PaymentsTab 
              payments={payments}
              setPayments={setPayments}
              stats={stats}
              setStats={setStats}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            <ReportsTab />
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-4 sm:space-y-6">
            <BannersTab 
              bannerAds={bannerAds}
              setBannerAds={setBannerAds}
            />
          </TabsContent>

          {/* Hero Slides Tab */}
          <TabsContent value="hero-slides">
            <HeroSlidesTab 
              heroSlides={heroSlides}
              setHeroSlides={setHeroSlides}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;