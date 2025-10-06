import React, { useState, useEffect } from 'react';
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

  // Filter banners based on date range
  const filteredBanners = banners.filter(banner => {
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

  if (loading) {
    return (
      <div className="relative h-64 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
        <div className="text-gray-500 dark:text-gray-400">Loading banners...</div>
      </div>
    );
  }

  if (filteredBanners.length === 0) {
    return (
      <div className="relative py-8">
        <div className="h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Special Offers</h3>
            <p className="text-lg">Check back soon for amazing deals!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                    // Fallback image on error
                    e.target.src = 'https://placehold.co/1200x400/cccccc/ffffff?text=Banner+Image';
                  }}
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
  );
};

export default BannerSlider;