import React, { useState, useEffect } from 'react';
import SEOHelmet from '../components/SEOHelmet';
import HeroSlider from '../components/HeroSlider';
import BannerSlider from '../components/BannerSlider';
import CategoriesGrid from '../components/CategoriesGrid';  // Updated import
import DiscountSection from '../components/DiscountSection';
import ExtraSection1 from '../components/ExtraSection1';
import ExtraSection2 from '../components/ExtraSection2';
import { useLanguage } from '../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../lib/i18n'; // Added translations import

const HomePage = () => {
  const { language } = useLanguage(); // Use language context
  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active hero slides
        const heroSlidesResponse = await fetch('/api/hero-slides?active=true');
        if (heroSlidesResponse.ok) {
          const heroSlidesData = await heroSlidesResponse.json();
          setHeroSlides(heroSlidesData);
        }

        // Fetch active banners
        const bannersResponse = await fetch('/api/banners?active=true');
        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          setBanners(bannersData);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SEOHelmet 
        title={t('home.seo.title', language)}
        description={t('home.seo.description', language)}
        keywords={t('home.seo.keywords', language)}
        type="website"
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Example of using translation - this would typically be used in components that have text */}
        <div className="sr-only">{t('common.welcome', language)}</div>
        <HeroSlider heroSlides={heroSlides} />
        <BannerSlider banners={banners} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CategoriesGrid />  
        </div>
        <DiscountSection />
        <ExtraSection1 />
        <ExtraSection2 />
      </div>
    </>
  );
};

export default HomePage;