import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/auth/AuthPage';
import ShopPage from './pages/shop/ShopPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/cart/CartPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import CategoryMedicines from './pages/dashboard/admin/CategoryMedicines';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import SellerDashboard from './pages/dashboard/seller/SellerDashboard';
import CheckoutPage from './pages/CheckoutPage.jsx';
import InvoicePage from './pages/InvoicePage';
import TestAPI from './test-api'; // Add this line
import TestDiscountPage from './test-discount';
import HealthTipsPage from './pages/HealthTipsPage';
import DiscountsPage from './pages/DiscountsPage'; // Add DiscountsPage import
import CouponTestPage from './pages/CouponTestPage'; // Add CouponTestPage import
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider> {/* Added LanguageProvider */}
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/cart" element={<CartPage />} />
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
                      <Route path="/test-api" element={<TestAPI />} /> {/* Add this line */}
                      <Route path="/test-discount" element={<TestDiscountPage />} />
                      <Route path="/health-tips" element={<HealthTipsPage />} />
                      <Route path="/discounts" element={<DiscountsPage />} /> {/* Add DiscountsPage route */}
                      <Route path="/coupon-test" element={<CouponTestPage />} /> {/* Add CouponTestPage route */}
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
                  {/* Floating Dark Mode Toggle */}
                  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 shadow-lg rounded-full px-4 py-2">
                      <span className="text-xs text-gray-700 dark:text-gray-200">Dark Mode</span>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                  </div>
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