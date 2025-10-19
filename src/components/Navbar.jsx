import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Globe, LogOut, Settings, BarChart3, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translation import

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { itemCount } = useCart();
  const { language, changeLanguage } = useLanguage(); // Use language context
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Updated languages array to only include Bangla and English
  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'BN', name: 'বাংলা' }, // Bangla
  ];

  const getDashboardLink = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'seller':
        return '/seller/dashboard';
      default:
        return '/user/dashboard';
    }
  };

  const userProfile = user
    ? {
        name: profile?.name || user.displayName || user.email,
        email: user.email,
        avatar: profile?.profilePicture || user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || user.email),
        role: profile?.role || 'user',
      }
    : null;

  // Function to handle language change
  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode); // Use context function
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">ureBay</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-colors duration-200 px-2 py-1 rounded-lg ${isActive ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-gray-900 shadow' : 'text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400'}`
              }
              end
            >
              {t('nav.home', language)} {/* Translated text */}
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `font-medium transition-colors duration-200 px-2 py-1 rounded-lg ${isActive ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-gray-900 shadow' : 'text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400'}`
              }
            >
              {t('nav.shop', language)} {/* Translated text */}
            </NavLink>
          </div>

          {/* Digital Clock - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
            <Clock className="w-4 h-4" />
            <div className="flex flex-col items-center">
              <span className="font-mono font-semibold">{formatTime(currentTime)}</span>
              <span className="text-xs opacity-75">{formatDate(currentTime)}</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 transition-colors duration-200">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm transition-colors duration-200">{language}</span> {/* Use context language */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`cursor-pointer ${language === lang.code ? 'bg-cyan-50 dark:bg-cyan-900/50 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs p-0"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {userProfile.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{userProfile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold capitalize">{userProfile.role}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      {t('nav.profile', language)} {/* Translated text */}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink(userProfile.role)} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {t('nav.dashboard', language)} {/* Translated text */}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout', language)} {/* Translated text */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  {t('nav.joinUs', language)} {/* Translated text */}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Clock */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <div className="flex flex-col items-center">
                  <span className="font-mono font-semibold">{formatTime(currentTime)}</span>
                  <span className="text-xs opacity-75">{formatDate(currentTime)}</span>
                </div>
              </div>
              
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home', language)} {/* Translated text */}
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.shop', language)} {/* Translated text */}
              </Link>
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.profile', language)} {/* Translated text */}
                  </Link>
                  <Link
                    to={getDashboardLink(userProfile.role)}
                    className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard', language)} {/* Translated text */}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    {t('nav.logout', language)} {/* Translated text */}
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-cyan-600 dark:text-cyan-400 font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.joinUs', language)} {/* Translated text */}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;