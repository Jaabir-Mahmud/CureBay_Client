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
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
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
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/admin/categories/:categoryId/medicines" element={<CategoryMedicines />} />
                {/* Additional routes will be added here */}
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/invoice" element={<InvoicePage />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
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
  </AuthProvider>
</HelmetProvider>
  );
}

export default App;

