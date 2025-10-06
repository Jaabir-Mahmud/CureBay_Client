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
  Calendar,
  Home,
  ShoppingCart,
  Bell,
  MessageSquare,
  HelpCircle,
  LogOut,
  Menu
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
import { CardBody, CardContainer, CardItem } from '../../../components/ui/3d-card';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { Separator } from '../../../components/ui/separator';
import './dashboard-styles.css'; // Import custom styles

// Import extracted components
import ManageUsers from '../../../components/dashboard/admin/ManageUsers';
import OverviewTab from '../../../components/dashboard/admin/OverviewTab';
import CategoriesTab from '../../../components/dashboard/admin/CategoriesTab';
import PaymentsTab from '../../../components/dashboard/admin/PaymentsTab';
import ReportsTab from '../../../components/dashboard/admin/ReportsTab';
import BannersTab from '../../../components/dashboard/admin/BannersTab';
import HeroSlidesTab from '../../../components/dashboard/admin/HeroSlidesTab';
import MedicineSlidesManager from '../../../components/dashboard/admin/MedicineSlidesManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'overview';
  });
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const { user, logout } = useAuth();
  
  // Categories state
  const [categories, setCategories] = useState([]);
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
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Fetch data when component mounts or active tab changes
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const token = await user.getIdToken();
        
        // Fetch overview stats
        const statsResponse = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          // Set default stats if API fails
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
        }
        
        // Fetch recent users
        const usersResponse = await fetch('/api/admin/recent-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setRecentUsers(Array.isArray(usersData) ? usersData : []);
        } else {
          setRecentUsers([]);
        }
        
        // Fetch pending payments
        const paymentsResponse = await fetch('/api/admin/pending-payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          setPendingPayments(Array.isArray(paymentsData) ? paymentsData : []);
        } else {
          setPendingPayments([]);
        }
        
        // Fetch categories
        console.log('Fetching categories...'); // Debug log
        const categoriesResponse = await fetch('/api/categories');
        console.log('Categories response status:', categoriesResponse.status); // Debug log
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('Fetched categories:', categoriesData); // Debug log
          // Ensure we have an array and handle potential null/undefined values
          const validCategories = Array.isArray(categoriesData) 
            ? categoriesData.filter(cat => cat !== null && cat !== undefined)
            : [];
          
          // If no categories exist, we might want to show a message or create defaults
          if (validCategories.length === 0) {
            console.log('No categories found, consider creating default categories');
          }
          
          setCategories(validCategories);
        } else {
          console.error('Failed to fetch categories:', categoriesResponse.status); // Debug log
          setCategories([]);
        }
        
        // Fetch all payments (orders with payment information)
        const allPaymentsResponse = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (allPaymentsResponse.ok) {
          const allPaymentsData = await allPaymentsResponse.json();
          // Transform orders to payment format
          const payments = Array.isArray(allPaymentsData) ? allPaymentsData.map(order => ({
            id: order._id,
            amount: order.totalAmount,
            customer: order.user?.name || order.user?.email || 'Unknown',
            email: order.user?.email || '',
            date: order.createdAt,
            status: order.paymentStatus
          })) : [];
          setPayments(payments);
        } else {
          setPayments([]);
        }
        
        // Fetch hero slides
        const heroSlidesResponse = await fetch('/api/hero-slides');
        if (heroSlidesResponse.ok) {
          const heroSlidesData = await heroSlidesResponse.json();
          setHeroSlides(Array.isArray(heroSlidesData) ? heroSlidesData : []);
        } else {
          setHeroSlides([]);
        }
        
        // Fetch banners
        const bannersResponse = await fetch('/api/banners');
        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          setBannerAds(Array.isArray(bannersData) ? bannersData : []);
        } else {
          setBannerAds([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

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
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/accept-payment/${orderId}`, { 
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to accept payment');
      setPendingPayments(payments => payments.filter(p => p.id !== orderId));
      // Optionally, refetch stats to update paid/pending totals
      fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setStats(data));
    } catch {
      alert('Failed to accept payment');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
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

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'banners', label: 'Banners', icon: Megaphone },
    { id: 'hero-slides', label: 'Hero Slides', icon: Image },
    { id: 'medicine-slides', label: 'Medicine Slides', icon: Pill },
  ];

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
        .sidebar-transition {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex">
        {/* Sidebar */}
        <div className={`bg-white dark:bg-gray-800 shadow-lg z-10 sidebar-transition ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">CureBay Admin</h1>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="ml-auto"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${sidebarOpen ? 'px-4' : 'px-2'} py-2 h-auto rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleTabChange(item.id)}
                    >
                      <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                      {sidebarOpen && <span>{item.label}</span>}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${sidebarOpen ? 'px-4' : 'px-2'} py-2 h-auto rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
              onClick={handleLogout}
            >
              <LogOut className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your CureBay platform</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.email || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
                <OverviewTab 
                  stats={stats}
                  recentUsers={recentUsers}
                  pendingPayments={pendingPayments}
                  acceptPayment={acceptPayment}
                />
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="mt-0">
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
              <TabsContent value="categories" className="space-y-4 sm:space-y-6 mt-0">
                <CategoriesTab 
                  categories={categories}
                  setCategories={setCategories}
                  activeTab={activeTab}
                />
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4 sm:space-y-6 mt-0">
                <PaymentsTab 
                  payments={payments}
                  setPayments={setPayments}
                  stats={stats}
                  setStats={setStats}
                />
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-4 sm:space-y-6 mt-0">
                <ReportsTab />
              </TabsContent>

              {/* Banners Tab */}
              <TabsContent value="banners" className="space-y-4">
                <BannersTab 
                  bannerAds={bannerAds}
                  setBannerAds={setBannerAds}
                  heroSlides={heroSlides}
                  setHeroSlides={setHeroSlides}
                />
              </TabsContent>

              {/* Hero Slides Tab */}
              <TabsContent value="hero-slides" className="mt-0">
                <HeroSlidesTab 
                  heroSlides={heroSlides}
                  setHeroSlides={setHeroSlides}
                />
              </TabsContent>

              {/* Medicine Slides Tab */}
              <TabsContent value="medicine-slides" className="mt-0">
                <MedicineSlidesManager 
                  bannerAds={bannerAds}
                  heroSlides={heroSlides}
                  setBannerAds={setBannerAds}
                  setHeroSlides={setHeroSlides}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;