import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translations import

const ExtraSection1 = () => {
  const { language } = useLanguage(); // Use language context

  const features = [
    {
      icon: Phone,
      title: t('extra1.support.title', language),
      description: t('extra1.support.description', language)
    },
    {
      icon: Mail,
      title: t('extra1.response.title', language),
      description: t('extra1.response.description', language)
    },
    {
      icon: Clock,
      title: t('extra1.delivery.title', language),
      description: t('extra1.delivery.description', language)
    },
    {
      icon: MapPin,
      title: t('extra1.nationwide.title', language),
      description: t('extra1.nationwide.description', language)
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('extra1.whyChoose', language)}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('extra1.committed', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('extra1.assistance', language)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('extra1.experts', language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3">
                {t('extra1.contact', language)}
              </Button>
              <Button variant="outline" className="px-8 py-3">
                {t('extra1.faq', language)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraSection1;