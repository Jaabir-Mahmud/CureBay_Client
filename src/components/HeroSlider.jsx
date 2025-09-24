import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Eye } from 'lucide-react';
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

  // Check if dark mode is active and set up observer
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Initial check
    checkDarkMode();
    
    // Set up observer for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Fetch hero slides from API
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
        // Fallback to empty slides - will show default welcome message
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const MedicineModal = ({ medicine }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{medicine.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-center">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold">{medicine.name}</h3>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{medicine.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-cyan-500">৳{medicine.price}</span>
          {medicine.originalPrice && (
            <span className="text-lg text-gray-500 line-through">৳{medicine.originalPrice}</span>
          )}
          {medicine.discountPercentage && (
            <Badge className="bg-red-500">-{medicine.discountPercentage}%</Badge>
          )}
        </div>

        <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="relative h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center transition-colors duration-300">
        <div className="text-gray-500 dark:text-gray-400 transition-colors">Loading slides...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center text-gray-900 dark:text-white transition-colors">
          <h2 className="text-3xl font-bold mb-4">Welcome to CureBay</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">Your trusted healthcare partner</p>
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
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
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={slides.length > 1}
        className="hero-slider h-[600px]"
      >
        {slides.map((slide) => {
          const backgroundGradient = isDarkMode ? slide.backgroundColor : slide.lightBackground;
          const textColor = isDarkMode ? slide.textColor : slide.lightTextColor;
          
          return (
          <SwiperSlide key={slide._id}>
            <div 
              className={`relative h-full overflow-hidden transition-colors duration-300`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              ></div>
              
              {/* Theme-based overlay with reduced opacity */}
              <div 
                className={`absolute inset-0 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-opacity-20' 
                    : `bg-gradient-to-r ${backgroundGradient} bg-opacity-30`
                }`}
              ></div>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                  {/* Left Content - Text */}
                  <div className={`space-y-6 ${textColor} transition-colors duration-300`}>
                    <div className="space-y-4">
                      <h2 className="text-lg font-medium opacity-90">{slide.subtitle}</h2>
                      <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl opacity-90 max-w-lg">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg" 
                        className={`px-8 py-4 text-lg font-medium transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-white text-gray-900 hover:bg-gray-100 border-white' 
                            : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-900'
                        }`}
                      >
                        {slide.buttonText}
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className={`px-8 py-4 text-lg font-medium transition-colors duration-300 ${
                          isDarkMode 
                            ? 'border-white text-white hover:bg-white hover:text-gray-900' 
                            : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-white'
                        }`}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Learn More
                      </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center space-x-6 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">1000+</div>
                        <div className="text-sm opacity-75">Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">50K+</div>
                        <div className="text-sm opacity-75">Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">24/7</div>
                        <div className="text-sm opacity-75">Support</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Content - Featured Medicine */}
                  {slide.featured && slide.featured.medicine && (
                    <div className="flex justify-center">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full transform hover:scale-105 transition-all duration-300">
                        <div className="text-center mb-4">
                          <Badge className="bg-red-500 text-white mb-2">
                            Featured Product
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          <img
                            src={slide.featured.medicine.image}
                            alt={slide.featured.medicine.name}
                            className="w-24 h-24 object-cover rounded-lg mx-auto"
                            onError={(e) => {
                              console.error('Error loading featured medicine image:', e);
                              e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                            }}
                          />
                          
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                              {slide.featured.medicine.name}
                            </h3>
                            
                            <div className="flex items-center justify-center space-x-1 mb-3">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                {slide.featured.medicine.rating}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-2 mb-4">
                              <span className="text-xl font-bold text-cyan-500">
                                ৳{slide.featured.medicine.price}
                              </span>
                              {slide.featured.medicine.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ৳{slide.featured.medicine.originalPrice}
                                </span>
                              )}
                              {slide.featured.medicine.discountPercentage && (
                                <Badge className="bg-red-100 text-red-700 text-xs">
                                  -{slide.featured.medicine.discountPercentage}%
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <MedicineModal medicine={slide.featured.medicine} />
                              </Dialog>
                              
                              <Button size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button className="hero-slider-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 dark:bg-black dark:bg-opacity-50 dark:hover:bg-opacity-75 text-gray-900 dark:text-white p-3 rounded-full transition-all duration-300 shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="hero-slider-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 dark:bg-black dark:bg-opacity-50 dark:hover:bg-opacity-75 text-gray-900 dark:text-white p-3 rounded-full transition-all duration-300 shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-slider .swiper-pagination {
          bottom: 20px;
        }
        .hero-slider .swiper-pagination-bullet {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'};
          width: 12px;
          height: 12px;
          transition: background-color 0.3s ease;
        }
        .hero-slider .swiper-pagination-bullet-active {
          background: ${isDarkMode ? 'white' : '#1f2937'};
        }
      `}} />
    </div>
  );
};

export default HeroSlider;