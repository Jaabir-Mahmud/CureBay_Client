import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Shield,
  Truck,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Help Center', href: '/help' }
  ];

  const categories = [
    { name: 'Tablets', href: '/category/tablets' },
    { name: 'Syrups', href: '/category/syrups' },
    { name: 'Capsules', href: '/category/capsules' },
    { name: 'Injections', href: '/category/injections' },
    { name: 'Supplements', href: '/category/supplements' },
    { name: 'Others', href: '/category/others' }
  ];

  const services = [
    { name: 'Online Consultation', href: '/consultation' },
    { name: 'Prescription Upload', href: '/prescription' },
    { name: 'Medicine Reminder', href: '/reminder' },
    { name: 'Health Checkup', href: '/checkup' },
    { name: 'Lab Tests', href: '/lab-tests' },
    { name: 'Health Insurance', href: '/insurance' }
  ];

  const features = [
    { icon: Shield, text: 'Verified Quality' },
    { icon: Truck, text: 'Fast Delivery' },
    { icon: Clock, text: '24/7 Support' },
    { icon: Heart, text: 'Expert Care' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-all duration-300">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-100 dark:bg-cyan-900/20 rounded-full opacity-20"></div>
        <div className="absolute top-20 -left-10 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-1/3 w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-20"></div>
      </div>
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">CureBay</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-base transition-colors duration-300">
              Your trusted healthcare partner, providing quality medicines and expert care 
              to help you live a healthier life. Available 24/7 for your convenience.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:text-cyan-600 dark:hover:text-cyan-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:text-green-600 dark:hover:text-green-400">support@curebay.com</span>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300 mt-1">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:text-purple-600 dark:hover:text-purple-400 leading-relaxed">306 Chapmans Lane, San Ysidro, NM 87053</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full mr-3"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-600 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.href}
                    className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-3"></div>
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href}
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-16 pt-12 transition-colors duration-300">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Why Choose CureBay?</h3>
            <p className="text-gray-600 dark:text-gray-300">We're committed to providing the best healthcare experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const colors = [
                { bg: 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30', icon: 'text-cyan-600 dark:text-cyan-400', hover: 'hover:from-cyan-200 hover:to-cyan-300' },
                { bg: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30', icon: 'text-green-600 dark:text-green-400', hover: 'hover:from-green-200 hover:to-green-300' },
                { bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30', icon: 'text-purple-600 dark:text-purple-400', hover: 'hover:from-purple-200 hover:to-purple-300' },
                { bg: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30', icon: 'text-orange-600 dark:text-orange-400', hover: 'hover:from-orange-200 hover:to-orange-300' }
              ];
              const colorSet = colors[index];
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 ${colorSet.bg} ${colorSet.hover} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg mb-4`}>
                    <IconComponent className={`w-8 h-8 ${colorSet.icon}`} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-16 pt-12 transition-colors duration-300">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl border border-gray-200/20 dark:border-gray-600/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-gray-100">Stay Updated with CureBay</h3>
              <p className="text-cyan-100 dark:text-gray-300 mb-8 text-lg transition-colors duration-300">
                Subscribe to our newsletter for health tips, special offers, and the latest updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 dark:focus:ring-gray-400/30 transition-all duration-300 text-lg"
                />
                <button className="bg-white hover:bg-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 text-cyan-600 dark:text-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-6 md:mb-0 transition-colors duration-300 text-center md:text-left">
              © {currentYear} CureBay. All rights reserved. | Made with <span className="text-red-500 mx-1">❤️</span> for better healthcare
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm mr-4">Follow us:</span>
              <a 
                href="#" 
                className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-600 dark:hover:bg-cyan-600 text-cyan-600 hover:text-white dark:text-cyan-400 dark:hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-500 dark:hover:bg-sky-500 text-sky-600 hover:text-white dark:text-sky-400 dark:hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-600 dark:hover:bg-pink-600 text-pink-600 hover:text-white dark:text-pink-400 dark:hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-700 dark:hover:bg-cyan-700 text-cyan-700 hover:text-white dark:text-cyan-400 dark:hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

