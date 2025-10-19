import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SEOHelmet from '../components/SEOHelmet';
import HeroSlider from '../components/HeroSlider';
import BannerSlider from '../components/BannerSlider';
import CategoriesGrid from '../components/CategoriesGrid';
import DiscountSection from '../components/DiscountSection';
import ExtraSection1 from '../components/ExtraSection1';
import ExtraSection2 from '../components/ExtraSection2';
import CustomerReviews from '../components/CustomerReviews';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

const HomePage = () => {
  const { language } = useLanguage();
  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    try {
      // Fetch active hero slides with proper error handling
      const heroSlidesResponse = await fetch('/api/hero-slides?active=true');
      if (heroSlidesResponse.ok) {
        const heroSlidesData = await heroSlidesResponse.json();
        setHeroSlides(Array.isArray(heroSlidesData) ? heroSlidesData : []);
      } else {
        setHeroSlides([]);
      }

      // Fetch active banners with proper error handling
      const bannersResponse = await fetch('/api/banners?active=true');
      if (bannersResponse.ok) {
        const bannersData = await bannersResponse.json();
        setBanners(Array.isArray(bannersData) ? bannersData : []);
      } else {
        setBanners([]);
      }
    } catch (error) {
      setHeroSlides([]);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add security headers to prevent XSS and other attacks
  useEffect(() => {
    // Add security meta tags
    const metaTags = [
      { name: 'referrer', content: 'no-referrer-when-downgrade' },
      { name: 'format-detection', content: 'telephone=no' }
    ];

    metaTags.forEach(tagData => {
      const metaTag = document.createElement('meta');
      Object.keys(tagData).forEach(key => {
        metaTag.setAttribute(key, tagData[key]);
      });
      document.head.appendChild(metaTag);
    });

    // Clean up meta tags on unmount
    return () => {
      metaTags.forEach(tagData => {
        const selector = `meta[name="${tagData.name}"]`;
        const metaTag = document.querySelector(selector);
        if (metaTag) {
          document.head.removeChild(metaTag);
        }
      });
    };
  }, []);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400 animate-pulse">
        {t('common.loading', language)}
      </div>
    </div>
  ), [language]);

  // Memoized main content
  const mainContent = useMemo(() => (
    <>
      <SEOHelmet 
        title={t('home.seo.title', language)}
        description={t('home.seo.description', language)}
        keywords={t('home.seo.keywords', language)}
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Add a simple check to see what we're passing */}
        {heroSlides && heroSlides.length > 0 ? (
          <HeroSlider heroSlides={heroSlides} />
        ) : (
          <div className="hero-slider-bg">
            <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Welcome to CureBay</h2>
                <p className="text-xl">Your trusted healthcare partner</p>
              </div>
            </div>
          </div>
        )}
        <BannerSlider banners={banners} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <CategoriesGrid />  
        </div>
        <DiscountSection />
        <CustomerReviews />
        <ExtraSection1 />
        <ExtraSection2 />
      </div>
    </>
  ), [language, heroSlides, banners]);

  if (loading) {
    return loadingComponent;
  }

  return mainContent;
};

export default React.memo(HomePage);