import React from 'react';
import { Calendar, Clock, ArrowRight, Play, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translations import

const HeroSection = () => {
  const { language } = useLanguage(); // Use language context

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-100 dark:bg-cyan-900/30 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 dark:bg-purple-900/30 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Right Content - Interactive Elements (now on the left) */}
          <div className="relative order-first lg:order-last">
            {/* Patient History Card */}
            <div className="absolute top-0 left-0 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-10 transform -rotate-2 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">B</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">Brian</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('home.hero.patient.age', language)}</p>
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">18%</Badge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">+10.57</p>
              </div>
            </div>

            {/* Heart Rate Card */}
            <div className="absolute top-20 right-0 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-10 transform rotate-1 transition-colors duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.hero.heart', language)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('home.hero.heartRate', language)}</p>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">74</p>
              </div>
            </div>

            {/* Central Circle with Play Button */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Large Circle Background */}
                <div className="w-96 h-96 bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center transition-colors duration-300">
                  {/* Inner Circle */}
                  <div className="w-80 h-80 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300">
                    {/* Play Button */}
                    <Button 
                      size="lg" 
                      className="w-16 h-16 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-xl transition-colors duration-300"
                    >
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-cyan-500 dark:bg-cyan-400 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.hero.tuesday', language)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right - Rights Reserved */}
            <div className="absolute bottom-0 right-0 text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">
              {t('footer.allRightsReserved', language)}
            </div>
          </div>

          {/* Left Content (now on the right) */}
          <div className="space-y-8 order-last lg:order-first">
            {/* Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800/50">
                <Heart className="w-3 h-3 mr-1" />
                {t('home.hero.checkup', language)}
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                {t('home.hero.highQualityCheckup', language)}
                <br />
                <span className="text-gray-700 dark:text-gray-300">{t('home.hero.makesYouHealthy', language)}</span>
              </h1>
            </div>

            {/* Appointment Scheduling */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.hero.date', language)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.hero.time', language)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl py-3 transition-colors duration-300">
                <span className="mr-2">{t('home.hero.guides', language)}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Reserve Button */}
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl text-lg font-medium dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {t('home.hero.reserveCheckup', language)}
            </Button>

            {/* Address */}
            <div className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              <p>{t('home.hero.address.line1', language)}</p>
              <p>{t('home.hero.address.line2', language)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;