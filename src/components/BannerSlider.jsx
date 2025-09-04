import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active banners from API
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/banners?active=true');
        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.status}`);
        }
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback to empty array
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="relative h-64 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading banners...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Don't show anything if there are no active banners
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
        loop={banners.length > 1}
        className="banner-slider h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative h-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                      {banner.title}
                    </h2>
                    {banner.description && (
                      <p className="text-lg text-gray-200 mb-6">
                        {banner.description}
                      </p>
                    )}
                    <Button 
                      asChild
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <a href={banner.link || '#'}>
                        Shop Now
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button className="banner-slider-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 p-2 rounded-full transition-all duration-300 shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="banner-slider-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 p-2 rounded-full transition-all duration-300 shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .banner-slider .swiper-pagination {
            bottom: 10px;
          }
          .banner-slider .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5);
            width: 10px;
            height: 10px;
            transition: background-color 0.3s ease;
          }
          .banner-slider .swiper-pagination-bullet-active {
            background: white;
          }
        `
      }} />
    </div>
  );
};

export default BannerSlider;