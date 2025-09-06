import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Eye, Sparkles, TrendingUp, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.hero-slider-container');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Check if dark mode is active and set up observer
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
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hero-slides?active=true');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch hero slides: ${response.status} ${response.statusText}. ${errorText}`);
        }
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          data = [];
        }
        setSlides(data);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-float opacity-20 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-500'}`}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i % 2)}s`
          }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
      ))}
      
      {/* Gradient orbs */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  );

  const AnimatedCounter = ({ end, label, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;
      
      let startTime = null;
      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [end, duration, isVisible]);

    return (
      <div className="text-center transform transition-all duration-500 hover:scale-110">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          {count.toLocaleString()}+
        </div>
        <div className="text-sm opacity-75">{label}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative h-[600px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading amazing deals...</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="hero-slider-container relative h-[600px] bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-all duration-500 overflow-hidden">
        <FloatingElements />
        <div className="text-center text-gray-900 dark:text-white transition-colors relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to CureBay
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Your trusted healthcare partner for wellness and care
            </p>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up shadow-cyan-500/25"
              style={{animationDelay: '0.4s'}}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slider-container relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.hero-slider-prev',
          nextEl: '.hero-slider-next',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={slides.length > 1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="hero-slider h-[600px]"
      >
        {slides.map((slide, index) => {
          const backgroundGradient = isDarkMode ? slide.backgroundColor : slide.lightBackground;
          const textColor = isDarkMode ? slide.textColor : slide.lightTextColor;
          
          return (
            <SwiperSlide key={slide._id}>
              <div 
                className="relative h-full overflow-hidden transition-all duration-700"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <FloatingElements />
                
                {/* Enhanced overlay with gradient mesh */}
                <div className="absolute inset-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    isDarkMode 
                      ? 'from-gray-900/95 via-gray-800/90 to-gray-900/95' 
                      : 'from-white/95 via-cyan-50/90 to-blue-50/95'
                  } transition-all duration-700`}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                  <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                    {/* Left Content with enhanced animations */}
                    <div className={`space-y-8 ${textColor} transition-all duration-700`}>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2 animate-fade-in-up">
                          <Award className="w-5 h-5 text-cyan-500" />
                          <span className="text-lg font-medium opacity-90 tracking-wide uppercase text-cyan-600 dark:text-cyan-400">
                            {slide.subtitle || "Premium Quality"}
                          </span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight animate-fade-in-up bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent" style={{animationDelay: '0.2s'}}>
                          {slide.title}
                        </h1>
                        
                        <p className="text-xl opacity-90 max-w-lg leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                          {slide.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                        <Button 
                          size="lg" 
                          className="px-8 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-none shadow-lg shadow-cyan-500/25"
                        >
                          <TrendingUp className="w-5 h-5 mr-2" />
                          {slide.buttonText || "Shop Now"}
                        </Button>
                        
                        <Button 
                          size="lg" 
                          variant="outline"
                          className={`px-8 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                            isDarkMode 
                              ? 'border-white/30 text-white hover:bg-white hover:text-gray-900 bg-white/5 backdrop-blur-sm' 
                              : 'border-gray-900/30 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/80 backdrop-blur-sm'
                          }`}
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          Learn More
                        </Button>
                      </div>

                      {/* Enhanced trust indicators */}
                      <div className="flex items-center space-x-8 pt-6 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                        <AnimatedCounter end={1000} label="Products" />
                        <AnimatedCounter end={50000} label="Customers" />
                        <AnimatedCounter end={24} label="Support" />
                      </div>
                    </div>

                    {/* Right Content with enhanced product showcase */}
                    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in-right">
                      {slide.featured && slide.featured.image ? (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                          <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
                            <img
                              src={slide.featured.image}
                              alt={slide.title}
                              className="hero-slider-image rounded-xl transition-all duration-500 group-hover:scale-105"
                            />
                            {slide.featured.medicine && (
                              <div className="absolute top-4 right-4 flex space-x-2">
                                <Badge className="bg-green-500 text-white animate-pulse">
                                  <Star className="w-3 h-3 mr-1" />
                                  {slide.featured.medicine.rating || "4.8"}
                                </Badge>
                                {slide.featured.medicine.discount && (
                                  <Badge className="bg-red-500 text-white animate-bounce">
                                    -{slide.featured.medicine.discount}%
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : slide.image ? (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="hero-slider-image rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 relative"
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-2 border-dashed rounded-2xl w-full h-96 flex items-center justify-center transition-colors">
                          <span className="text-gray-500 dark:text-gray-400">No image available</span>
                        </div>
                      )}
                      
                      {/* Enhanced pricing section */}
                      {(slide.featured && (slide.featured.medicine || slide.featured.price)) || slide.title ? (
                        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
                          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            {slide.featured && slide.featured.medicine ? (
                              <>
                                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                                  ${slide.featured.medicine.price}
                                </span>
                                {slide.featured.medicine.originalPrice && (
                                  <span className="text-xl text-gray-500 line-through opacity-75">
                                    ${slide.featured.medicine.originalPrice}
                                  </span>
                                )}
                              </>
                            ) : slide.featured && slide.featured.price ? (
                              <>
                                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                                  ${slide.featured.price}
                                </span>
                                {slide.featured.originalPrice && (
                                  <span className="text-xl text-gray-500 line-through opacity-75">
                                    ${slide.featured.originalPrice}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                                
                              </span>
                            )}
                          </div>
                          
                          
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Enhanced Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button className="hero-slider-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 text-gray-900 dark:text-white p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-white/30">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="hero-slider-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 text-gray-900 dark:text-white p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-white/30">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Enhanced Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-slider .swiper-pagination {
          bottom: 30px;
          z-index: 10;
        }
        .hero-slider .swiper-pagination-bullet {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
          width: 14px;
          height: 14px;
          margin: 0 6px;
          transition: all 0.3s ease;
          border: 2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
        }
        .hero-slider .swiper-pagination-bullet-active {
          background: ${isDarkMode ? 'white' : '#0891b2'};
          transform: scale(1.2);
          border-color: ${isDarkMode ? 'white' : '#0891b2'};
        }
        .hero-slider .swiper-pagination-bullet:hover {
          transform: scale(1.1);
        }
        .hero-slider-image {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Glassmorphism effects */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        /* Smooth transitions for theme switching */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        
        /* Hover effects */
        .group:hover .hero-slider-image {
          filter: drop-shadow(0 25px 50px rgba(6, 182, 212, 0.3));
        }
        
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1f2937' : '#f1f5f9'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#374151' : '#cbd5e1'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#4b5563' : '#94a3b8'};
        }
      `}} />
    </div>
  );
};

export default HeroSlider;