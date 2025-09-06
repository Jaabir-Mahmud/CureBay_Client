import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Info, Bell, CheckCircle, Calendar, MapPin, Users, Award, Truck, Pill, Heart, Stethoscope, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Check theme
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
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
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const getBannerIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('shipping') || titleLower.includes('delivery')) return Truck;
    if (titleLower.includes('offer') || titleLower.includes('discount') || titleLower.includes('sale')) return Award;
    if (titleLower.includes('prescription') || titleLower.includes('medication')) return Pill;
    if (titleLower.includes('health') || titleLower.includes('wellness')) return Heart;
    if (titleLower.includes('consultation') || titleLower.includes('pharmacist')) return Stethoscope;
    if (titleLower.includes('new')) return Bell;
    return Info;
  };

  const getBannerColor = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('shipping') || titleLower.includes('delivery')) return 'from-blue-500 to-indigo-600';
    if (titleLower.includes('offer') || titleLower.includes('discount') || titleLower.includes('sale')) return 'from-green-500 to-emerald-600';
    if (titleLower.includes('prescription') || titleLower.includes('medication')) return 'from-purple-500 to-violet-600';
    if (titleLower.includes('health') || titleLower.includes('wellness')) return 'from-teal-500 to-cyan-600';
    if (titleLower.includes('consultation') || titleLower.includes('pharmacist')) return 'from-amber-500 to-orange-600';
    if (titleLower.includes('new')) return 'from-pink-500 to-rose-600';
    return 'from-cyan-500 to-blue-600';
  };

  if (loading) {
    return (
      <div className="relative my-6 mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-28 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl flex items-center justify-center shadow-inner">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
              <div className="text-slate-500 dark:text-slate-400 text-sm">Loading health updates...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative my-6 mx-4">
      <div className="max-w-7xl mx-auto">
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
            renderBullet: (index, className) => {
              return `<span class="${className} custom-bullet"></span>`;
            },
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={banners.length > 1}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="banner-slider h-28 rounded-2xl overflow-hidden shadow-lg"
        >
          {banners.map((banner, index) => {
            const IconComponent = getBannerIcon(banner.title);
            const gradientColor = getBannerColor(banner.title);
            
            return (
              <SwiperSlide key={banner._id}>
                <div className={`relative h-full bg-gradient-to-r ${gradientColor} overflow-hidden group cursor-pointer`}>
                  {/* Subtle pattern background */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                  </div>

                  <div className="relative h-full flex items-center">
                    <div className="flex items-center justify-between w-full px-6">
                      {/* Left Section - Icon & Content */}
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Icon Container */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-base font-bold text-white truncate">
                              {banner.title}
                            </h3>
                            {index === 0 && (
                              <Badge className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5">
                                NEW
                              </Badge>
                            )}
                          </div>
                          {banner.description && (
                            <p className="text-sm text-white/90 truncate">
                              {banner.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Section - CTA */}
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        {/* CTA Button */}
                        <Button 
                          asChild
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/40 hover:border-white/60 backdrop-blur-sm transition-all duration-300 shadow-md text-xs px-3 py-1.5"
                        >
                          <a href={banner.link || '#'}>
                            <span className="font-medium">View</span>
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30">
                    <div 
                      className="h-full bg-white transition-all duration-300 ease-out"
                      style={{
                        width: index === activeIndex ? '100%' : '0%',
                        transitionDuration: index === activeIndex ? '6s' : '0s'
                      }}
                    ></div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Minimal Navigation */}
        {banners.length > 1 && (
          <div className="flex justify-center items-center mt-3 space-x-4">
            <button className="banner-slider-prev w-7 h-7 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => {
                    const swiper = document.querySelector('.banner-slider').swiper;
                    swiper.slideToLoop(index);
                  }}
                ></button>
              ))}
            </div>

            <button className="banner-slider-next w-7 h-7 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .banner-slider .swiper-pagination {
            display: none;
          }
          
          .banner-slider .swiper-slide-active .flex:first-child > div:first-child {
            animation: slideInLeft 0.5s ease-out;
          }
          
          .banner-slider .swiper-slide-active .flex:first-child > div:last-child {
            animation: slideInRight 0.5s ease-out 0.1s both;
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-15px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(15px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          /* Custom backdrop blur for better browser support */
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .banner-slider {
              height: 100px;
            }
          }
          
          @media (max-width: 480px) {
            .banner-slider {
              height: 90px;
            }
            
            .banner-slider h3 {
              font-size: 0.875rem;
            }
            
            .banner-slider p {
              font-size: 0.75rem;
            }
          }
        `
      }} />
    </div>
  );
};

export default BannerSlider;