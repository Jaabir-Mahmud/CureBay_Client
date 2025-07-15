import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/auth/AuthPage';
import ShopPage from './pages/shop/ShopPage';
import CartPage from './pages/cart/CartPage';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
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
  return (
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Additional routes will be added here */}
              <Route path="/category/:categoryName" element={<ShopPage />} />
              <Route path="/checkout" element={<div className="p-8 text-center">Checkout Page - Coming Soon</div>} />
              <Route path="/seller/dashboard" element={<div className="p-8 text-center">Seller Dashboard - Coming Soon</div>} />
              <Route path="/user/dashboard" element={<div className="p-8 text-center">User Dashboard - Coming Soon</div>} />
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
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

