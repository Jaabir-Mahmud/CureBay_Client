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
    <footer className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">CureBay</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">
              Your trusted healthcare partner, providing quality medicines and expert care 
              to help you live a healthier life. Available 24/7 for your convenience.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">support@curebay.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">306 Chapmans Lane, San Ysidro, NM 87053</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href}
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 transition-colors duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 transition-colors duration-300">
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:mx-0">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
              Subscribe to our newsletter for health tips, special offers, and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0 transition-colors duration-300">
              © {currentYear} CureBay. All rights reserved. | Made with ❤️ for better healthcare
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
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

