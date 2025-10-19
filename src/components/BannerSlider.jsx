import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSlider = ({ banners = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once banners prop is received
    if (banners.length > 0 || !loading) {
      setLoading(false);
    }
  }, [banners]);

  // Memoized banner filtering
  const filteredBanners = useMemo(() => {
    return banners.filter(banner => {
      // Validate banner data
      if (!banner || typeof banner !== 'object') return false;
      
      const now = new Date();
      const startDate = banner.startDate ? new Date(banner.startDate) : null;
      const endDate = banner.endDate ? new Date(banner.endDate) : null;
      
      // Check if banner is active and within date range
      return banner.active && 
             (!startDate || now >= startDate) && 
             (!endDate || now <= endDate);
    });
  }, [banners]);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="relative h-64 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
      <div className="text-gray-500 dark:text-gray-400">Loading banners...</div>
    </div>
  ), []);

  // Memoized no banners component
  const noBannersComponent = useMemo(() => (
    <div className="relative py-8">
      <div className="h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Special Offers</h3>
          <p className="text-lg">Check back soon for amazing deals!</p>
        </div>
      </div>
    </div>
  ), []);

  // Memoized main content
  const mainContent = useMemo(() => (
    <div className="relative py-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.banner-slider-prev',
          nextEl: '.banner-slider-next',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={filteredBanners.length > 1}
        className="banner-slider h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
        // Add performance optimizations
        updateOnWindowResize={true}
        observer={true}
        observeParents={true}
      >
        {filteredBanners.map((banner) => {
          // Validate banner data
          if (!banner || typeof banner !== 'object') return null;
          
          return (
            <SwiperSlide key={banner._id}>
              <div className="relative h-full">
                <img
                  src={banner.image}
                  alt={banner.title || 'Banner image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a reliable data URL
                    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1200\' height=\'400\' viewBox=\'0 0 1200 400\'%3e%3crect width=\'1200\' height=\'400\' fill=\'%23cccccc\'/%3e%3ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'system-ui\' font-size=\'24\' fill=\'%23ffffff\'%3eBanner Image%3c/text%3e%3c/svg%3e';
                    // Prevent infinite error loop
                    e.target.onerror = null;
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl pl-4 md:pl-8">
                      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        {banner.title}
                      </h2>
                      {banner.description && (
                        <p className="text-xl text-gray-200 mb-8 max-w-lg">
                          {banner.description}
                        </p>
                      )}
                      <Button 
                        asChild
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <a 
                          href={banner.link || '#'}
                          onClick={(e) => {
                            if (!banner.link || banner.link === '#') {
                              e.preventDefault();
                            }
                          }}
                        >
                          Shop Now
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {filteredBanners.length > 1 && (
        <>
          <button 
            className="banner-slider-prev absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            className="banner-slider-next absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .banner-slider .swiper-pagination {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
          }
          .banner-slider .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5);
            width: 12px;
            height: 12px;
            transition: all 0.3s ease;
            opacity: 1;
            margin: 0 6px;
          }
          .banner-slider .swiper-pagination-bullet-active {
            background: white;
            transform: scale(1.2);
          }
          .banner-slider .swiper-pagination-bullet:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: scale(1.1);
          }
        `
      }} />
    </div>
  ), [filteredBanners]);

  if (loading) {
    return loadingComponent;
  }

  if (filteredBanners.length === 0) {
    return noBannersComponent;
  }

  return mainContent;
};

export default React.memo(BannerSlider);