import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // Added ScrollToTop import
import HomePage from './pages/HomePage';
import AuthPage from './pages/auth/AuthPage';
import ShopPage from './pages/shop/ShopPage';
import CategoryPage from './pages/CategoryPage';
import MedicineDetailsPage from './pages/MedicineDetailsPage'; // Add this line
import CartPage from './pages/cart/CartPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import CategoryMedicines from './pages/dashboard/admin/CategoryMedicines';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import SellerDashboard from './pages/dashboard/seller/SellerDashboard';
import CheckoutPage from './pages/CheckoutPage.jsx';
import InvoicePage from './pages/InvoicePage';
import HealthTipsPage from './pages/HealthTipsPage';
import DiscountsPage from './pages/DiscountsPage'; // Add DiscountsPage import

import AllCategoriesPage from './pages/AllCategoriesPage'; // Add AllCategoriesPage import

// Quick Links Pages
import AboutUsPage from './pages/quicklinks/AboutUsPage';
import ContactPage from './pages/quicklinks/ContactPage';
import PrivacyPolicyPage from './pages/quicklinks/PrivacyPolicyPage';
import TermsOfServicePage from './pages/quicklinks/TermsOfServicePage';
import FAQPage from './pages/quicklinks/FAQPage';
import HelpCenterPage from './pages/quicklinks/HelpCenterPage';

// Services Pages
import OnlineConsultationPage from './pages/services/OnlineConsultationPage';
import PrescriptionUploadPage from './pages/services/PrescriptionUploadPage';
import MedicineReminderPage from './pages/services/MedicineReminderPage';
import HealthCheckupPage from './pages/services/HealthCheckupPage';
import LabTestsPage from './pages/services/LabTestsPage';
import HealthInsurancePage from './pages/services/HealthInsurancePage';

import ProtectedRoute from './components/ProtectedRoute'; // Added ProtectedRoute import
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext'; // Added LanguageProvider import
import { Switch } from './components/ui/switch';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  // Simple dark mode state using localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Optimized dark mode toggle function with debouncing
  const toggleDarkMode = useCallback((newDarkMode) => {
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      // Apply dark mode class immediately
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Trigger a reflow to ensure styles are applied
      document.documentElement.offsetHeight;
    });
  }, []);

  // Optimized useEffect for dark mode changes with cleanup
  useEffect(() => {
    // Apply initial dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference in localStorage
    localStorage.setItem('darkMode', darkMode);
    
    // Cleanup function
    return () => {
      // No specific cleanup needed for this effect
    };
  }, [darkMode]);

  // Memoized dark mode toggle component with optimized rendering
  const DarkModeToggle = useMemo(() => (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 shadow-lg rounded-full px-4 py-2 transition-all duration-200 ease-out">
        <span className="text-xs text-gray-700 dark:text-gray-200">Dark Mode</span>
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      </div>
    </div>
  ), [darkMode, toggleDarkMode]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider> {/* Added LanguageProvider */}
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <ScrollToTop /> {/* Added ScrollToTop component */}
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/medicine/:medicineId" element={<MedicineDetailsPage />} /> {/* Add this line */}
                      <Route path="/all-categories" element={<AllCategoriesPage />} /> {/* Add this line */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/admin" element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/admin/categories/:categoryId/medicines" element={
                        <ProtectedRoute>
                          <CategoryMedicines />
                        </ProtectedRoute>
                      } />
                      {/* Additional routes will be added here */}
                      <Route path="/category/:categoryName" element={<CategoryPage />} />
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/invoice" element={
                        <ProtectedRoute>
                          <InvoicePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/seller/dashboard" element={
                        <ProtectedRoute>
                          <SellerDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/user/dashboard" element={
                        <ProtectedRoute>
                          <UserDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/health-tips" element={<HealthTipsPage />} />
                      <Route path="/discounts" element={<DiscountsPage />} /> {/* Add DiscountsPage route */}
                      
                      
                      {/* Quick Links Routes */}
                      <Route path="/about" element={<AboutUsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms" element={<TermsOfServicePage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/help" element={<HelpCenterPage />} />
                      
                      {/* Services Routes */}
                      <Route path="/consultation" element={<OnlineConsultationPage />} />
                      <Route path="/prescription" element={<PrescriptionUploadPage />} />
                      <Route path="/reminder" element={<MedicineReminderPage />} />
                      <Route path="/checkup" element={<HealthCheckupPage />} />
                      <Route path="/lab-tests" element={<LabTestsPage />} />
                      <Route path="/insurance" element={<HealthInsurancePage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        theme: {
                          primary: '#4aed88',
                        },
                      },
                    }}
                  />
                  {DarkModeToggle}
                </div>
              </Router>
            </QueryClientProvider>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;