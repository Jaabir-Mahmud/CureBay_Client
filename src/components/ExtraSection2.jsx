import React from 'react';
import { Shield, Truck, Clock, Award, Users, HeartHandshake } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translations import
import { Link } from 'react-router-dom'; // Changed from useNavigate to Link

const ExtraSection2 = () => {
  const { language } = useLanguage(); // Use language context

  const features = [
    {
      id: 1,
      icon: Shield,
      title: t('extra2.quality.title', language),
      description: t('extra2.quality.description', language),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 2,
      icon: Truck,
      title: t('extra2.delivery.title', language),
      description: t('extra2.delivery.description', language),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      icon: Clock,
      title: t('extra2.support.title', language),
      description: t('extra2.support.description', language),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      icon: Award,
      title: t('extra2.prices.title', language),
      description: t('extra2.prices.description', language),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 5,
      icon: Users,
      title: t('extra2.trusted.title', language),
      description: t('extra2.trusted.description', language),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 6,
      icon: HeartHandshake,
      title: t('extra2.expert.title', language),
      description: t('extra2.expert.description', language),
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const stats = [
    { label: t('extra2.stats.customers', language), value: '50,000+' },
    { label: t('extra2.stats.medicines', language), value: '10,000+' },
    { label: t('extra2.stats.pharmacies', language), value: '500+' },
    { label: t('extra2.stats.cities', language), value: '100+' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            {t('extra2.whyChoose', language)}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            {t('extra2.committed', language)}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${feature.bgColor} dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.color} dark:text-gray-300`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 lg:p-12 transition-colors">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              {t('extra2.trustedPartner', language)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              {t('extra2.numbers', language)}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - Changed color to match Navbar CureBay icon */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12 text-white dark:text-gray-100 border border-gray-200/20 dark:border-gray-600/30 transition-all duration-300">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              {t('extra2.betterHealthcare', language)}
            </h3>
            <p className="text-cyan-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              {t('extra2.join', language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Updated buttons with Link components */}
              <Link to="/shop">
                <button className="bg-white text-cyan-600 hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                  {t('extra2.browse', language)}
                </button>
              </Link>
              <Link to="/contact">
                <button className="border-2 border-white text-white hover:bg-white hover:text-cyan-600 dark:border-gray-400 dark:text-gray-100 dark:hover:bg-gray-400 dark:hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                  {t('extra2.contactSupport', language)}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraSection2;