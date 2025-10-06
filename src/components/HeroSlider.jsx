import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSlider.css';

const HeroSlider = ({ heroSlides = [] }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState({ products: 0, customers: 0, support: 0 });
  const showNavigation = heroSlides.length > 1;

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
    // Fetch stats from API with better error handling
    const fetchStats = async () => {
      try {
        console.log('Fetching stats from /api/stats');
        const res = await fetch('/api/stats');
        console.log('Stats response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Stats data received:', data);
        
        // Validate and sanitize stats data
        setStats({
          products: typeof data.products === 'number' ? data.products : 0,
          customers: typeof data.customers === 'number' ? data.customers : 0,
          support: typeof data.support === 'number' ? data.support : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to test data for debugging
        setStats({ products: 300, customers: 1, support: 5 });
      }
    };
    
    fetchStats();
  }, []);

  // Filter slides based on date range
  const filteredSlides = heroSlides.filter(slide => {
    // Validate slide data
    if (!slide || typeof slide !== 'object') return false;
    
    const now = new Date();
    const startDate = slide.startDate ? new Date(slide.startDate) : null;
    const endDate = slide.endDate ? new Date(slide.endDate) : null;
    
    // Check if slide is active and within date range
    return slide.active && 
           (!startDate || now >= startDate) && 
           (!endDate || now <= endDate);
  });

  if (filteredSlides.length === 0) {
    return (
      <div className="hero-slider-bg">
        <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome to CureBay</h2>
            <p className="text-xl">Your trusted healthcare partner</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slider-bg">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={showNavigation}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={filteredSlides.length > 1}
        className="hero-swiper"
        slidesPerView={1}
        spaceBetween={0}
        speed={1000}
      >
        {filteredSlides.map((slide, idx) => {
          // Validate slide data
          if (!slide || typeof slide !== 'object') return null;
          
          return (
            <SwiperSlide key={slide._id || idx}>
              <div 
                className="hero-slide-content"
                style={{
                  backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Overlay for better text visibility */}
                <div className="hero-slide-overlay"></div>
                
                <div className="hero-slide-container">
                  <div className="hero-slide-left">
                    <span className="hero-subtitle">{slide.subtitle}</span>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-desc">{slide.description}</p>
                    <div className="hero-btns">
                      <a 
                        href={slide.buttonLink || '#'} 
                        className="hero-btn primary"
                        onClick={(e) => {
                          if (!slide.buttonLink || slide.buttonLink === '#') {
                            e.preventDefault();
                          }
                        }}
                      >
                        {slide.buttonText || 'Shop Now'}
                      </a>
                    </div>
                    <div className="hero-stats">
                      <div><span>{stats.products}+</span> Products</div>
                      <div><span>{stats.customers}+</span> Customers</div>
                      <div><span>{stats.support}+</span> Support</div>
                    </div>
                  </div>
                  <div className="hero-slide-right">
                    {/* Featured product with dynamic image */}
                    <div className="hero-featured-content">
                      <div className="hero-badge">
                        <span className="hero-badge-text">Featured</span>
                      </div>
                      <div className="hero-product-card">
                        <div className="hero-product-image-container">
                          <div 
                            className="hero-product-image"
                            style={{
                              backgroundImage: slide.featured && slide.featured.medicine && slide.featured.medicine.image ? 
                                `url(${slide.featured.medicine.image})` : 
                                (slide.image ? `url(${slide.image})` : 'none'),
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          ></div>
                        </div>
                        <div className="hero-product-info">
                          <h3 className="hero-product-title">
                            {slide.featured && slide.featured.medicine && slide.featured.medicine.name ? 
                              slide.featured.medicine.name : 
                              "Featured Product"}
                          </h3>
                          <p className="hero-product-desc">
                            {slide.featured && slide.featured.medicine && slide.featured.medicine.description ? 
                              slide.featured.medicine.description.substring(0, 100) + "..." : 
                              "Premium healthcare solution"}
                          </p>
                          <div className="hero-product-stats">
                            <span className="hero-product-rating">★★★★★</span>
                            <span className="hero-product-reviews">(128 reviews)</span>
                          </div>
                          <div className="hero-product-price">
                            <span className="hero-product-old-price">
                              {slide.featured && slide.featured.medicine && slide.featured.medicine.price ? 
                                `$${(slide.featured.medicine.price * 1.2).toFixed(2)}` : 
                                '$49.99'}
                            </span>
                            <span className="hero-product-new-price">
                              {slide.featured && slide.featured.medicine && slide.featured.medicine.price ? 
                                `$${slide.featured.medicine.price.toFixed(2)}` : 
                                '$39.99'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HeroSlider;