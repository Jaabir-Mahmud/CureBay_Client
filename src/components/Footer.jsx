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
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translation import

const Footer = () => {
  const { language } = useLanguage(); // Use language context
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: t('footer.aboutUs', language), href: '/about' },
    { name: t('footer.contact', language), href: '/contact' },
    { name: t('footer.privacyPolicy', language), href: '/privacy' },
    { name: t('footer.termsOfService', language), href: '/terms' },
    { name: t('footer.faq', language), href: '/faq' },
    { name: t('footer.helpCenter', language), href: '/help' }
  ];

  const categories = [
    { name: t('footer.tablets', language), href: '/category/tablets' },
    { name: t('footer.syrups', language), href: '/category/syrups' },
    { name: t('footer.capsules', language), href: '/category/capsules' },
    { name: t('footer.injections', language), href: '/category/injections' },
    { name: t('footer.supplements', language), href: '/category/supplements' },
    { name: t('footer.others', language), href: '/category/others' }
  ];

  const services = [
    { name: t('footer.onlineConsultation', language), href: '/consultation' },
    { name: t('footer.prescriptionUpload', language), href: '/prescription' },
    { name: t('footer.medicineReminder', language), href: '/reminder' },
    { name: t('footer.healthCheckup', language), href: '/checkup' },
    { name: t('footer.labTests', language), href: '/lab-tests' },
    { name: t('footer.healthInsurance', language), href: '/insurance' }
  ];

  const features = [
    { icon: Shield, text: t('footer.verifiedQuality', language) },
    { icon: Truck, text: t('footer.fastDelivery', language) },
    { icon: Clock, text: t('footer.support247', language) },
    { icon: Heart, text: t('footer.expertCare', language) }
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
              {t('footer.description', language)}
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
              {t('footer.quickLinks', language)}
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
              {t('footer.categories', language)}
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
              {t('footer.services', language)}
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('extra1.whyChoose', language)}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('footer.whyChooseDescription', language)}</p>
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
              <h3 className="text-2xl font-bold mb-4 text-white dark:text-gray-100">{t('footer.stayUpdated', language)}</h3>
              <p className="text-cyan-100 dark:text-gray-300 mb-8 text-lg transition-colors duration-300">
                {t('footer.stayUpdatedDescription', language)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder', language)}
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-cyan-500 dark:bg-white/10 dark:text-white dark:placeholder-gray-300"
                />
                <button className="px-6 py-3 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                  {t('footer.subscribe', language)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © {currentYear} CureBay. {t('footer.allRightsReserved', language)}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors duration-300">
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