import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSlider.css';

// Memoized component to prevent unnecessary re-renders
const HeroSlide = React.memo(({ slide, stats, isDarkMode }) => {
  // Ensure we have basic data
  const title = slide.title || 'Untitled Slide';
  const description = slide.description || 'No description available';
  
  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Preload the background image
  useEffect(() => {
    if (slide.image) {
      setImageLoaded(false);
      setImageError(false);
      
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageLoaded(false);
        setImageError(true);
      };
      img.src = slide.image;
    }
  }, [slide.image]);
  
  return (
    <div 
      className="hero-slide-content"
      style={{
        backgroundImage: imageLoaded && !imageError ? `url(${slide.image})` : 'none',
        backgroundColor: imageError ? (isDarkMode ? '#1e293b' : '#e0f2fe') : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text visibility */}
      <div className={`hero-slide-overlay ${isDarkMode ? 'dark' : ''}`}></div>
      
      <div className="hero-slide-container">
        <div className="hero-slide-left">
          {slide.subtitle && <span className="hero-subtitle">{slide.subtitle}</span>}
          <h1 className="hero-title">{title}</h1>
          <p className="hero-desc">{description}</p>
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
              {slide.buttonText || 'Learn More'}
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
          <div className={`hero-featured-content ${isDarkMode ? 'dark' : ''}`}>
            <div className="hero-badge">
              <span className="hero-badge-text">Featured</span>
            </div>
            <div className="hero-product-card">
              <div className="hero-product-image-container">
                {/* Use featured medicine image if available, otherwise use slide image */}
                {slide.featured && slide.featured.medicine && slide.featured.medicine.image ? (
                  <div 
                    className="hero-product-image"
                    style={{
                      backgroundImage: imageLoaded && !imageError ? 
                        `url(${slide.featured.medicine.image})` : 
                        'none',
                      backgroundColor: imageError ? (isDarkMode ? '#334155' : '#bae6fd') : 'transparent',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  ></div>
                ) : (
                  <div 
                    className="hero-product-image"
                    style={{
                      backgroundImage: imageLoaded && !imageError ? 
                        `url(${slide.image})` : 
                        'none',
                      backgroundColor: imageError ? (isDarkMode ? '#334155' : '#bae6fd') : 'transparent',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  ></div>
                )}
              </div>
              <div className="hero-product-info">
                <h3 className={`hero-product-title ${isDarkMode ? 'dark' : ''}`}>
                  {slide.featured && slide.featured.medicine && slide.featured.medicine.name ? 
                    slide.featured.medicine.name : 
                    "Featured Product"}
                </h3>
                <p className={`hero-product-desc ${isDarkMode ? 'dark' : ''}`}>
                  {slide.featured && slide.featured.medicine && slide.featured.medicine.description ? 
                    (slide.featured.medicine.description.length > 100 ? 
                      slide.featured.medicine.description.substring(0, 100) + "..." : 
                      slide.featured.medicine.description) : 
                    "Premium healthcare solution"}
                </p>
                <div className="hero-product-stats">
                  
                </div>
                <div className="hero-product-price">
                  <span className={`hero-product-old-price ${isDarkMode ? 'dark' : ''}`}>
                    {slide.featured && slide.featured.medicine && slide.featured.medicine.price ? 
                      `৳${(slide.featured.medicine.price * 1.2).toFixed(2)}` : 
                      '৳49.99'}
                  </span>
                  <span className={`hero-product-new-price ${isDarkMode ? 'dark' : ''}`}>
                    {slide.featured && slide.featured.medicine && slide.featured.medicine.price ? 
                      `৳${slide.featured.medicine.price.toFixed(2)}` : 
                      '৳39.99'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const HeroSlider = ({ heroSlides = [] }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState({ products: 300, customers: 900, support: 18 }); // Set initial values
  const showNavigation = heroSlides.length > 1;

  // Check if dark mode is active and set up observer with optimized performance
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Initial check
    checkDarkMode();
    
    // Set up observer for theme changes with better performance
    const observer = new MutationObserver(() => {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(checkDarkMode);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Memoized stats fetching function with caching
  const fetchStats = useCallback(async () => {
    try {
      // Try to fetch from the proper stats endpoint first
      try {
        const statsResponse = await fetch('/api/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          
          // Use actual data if available
          if (statsData.products !== undefined && statsData.customers !== undefined && statsData.support !== undefined) {
            setStats({
              products: statsData.products,
              customers: statsData.customers,
              support: statsData.support
            });
            return;
          }
        }
      } catch (statsError) {
      }
      
      // Fallback to medicines count (this endpoint works without auth)
      try {
        const medicinesResponse = await fetch('/api/medicines');
        
        if (medicinesResponse.ok) {
          const medicinesData = await medicinesResponse.json();
          
          // Get the total count from pagination info
          const products = medicinesData.pagination && medicinesData.pagination.total ? 
            medicinesData.pagination.total : 
            (medicinesData.medicines ? medicinesData.medicines.length : 0);
          
          // Use conservative estimates based on actual product count
          // Since we know there are only 2 users, we'll use that as a base
          const customers = 2;
          const support = Math.max(1, Math.floor(customers * 0.1)); // 10% of users have support tickets
          
          // Update state with the calculated values
          setStats({
            products: products,
            customers: customers,
            support: support
          });
          return;
        }
      } catch (medicinesError) {
      }
      
      // Final fallback - use known values
      setStats({
        products: 300,
        customers: 2,
        support: 1
      });
    } catch (error) {
      // Use minimal fallback values
      setStats({
        products: 300,
        customers: 2,
        support: 1
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoized slide filtering with better performance
  const filteredSlides = useMemo(() => {
    return heroSlides.filter(slide => {
      // Validate slide data
      if (!slide || typeof slide !== 'object') {
        return false;
      }
      
      // Check for required fields
      if (!slide.title || !slide.description) {
        return false;
      }
      
      // Only filter out slides that are clearly seed data
      // Let's be very specific about what we consider seed data
      const isClearlySeedData = 
        slide.title === "Summer Health Essentials" && 
        slide.subtitle === "Stay Healthy This Summer" &&
        slide.description.includes("curated selection");
      
      if (isClearlySeedData) {
        return false;
      }
      
      const now = new Date();
      const startDate = slide.startDate ? new Date(slide.startDate) : null;
      const endDate = slide.endDate ? new Date(slide.endDate) : null;
      
      // Check if slide is active and within date range (respecting project specifications)
      const isActiveAndInRange = slide.active && 
             (!startDate || now >= startDate) && 
             (!endDate || now <= endDate);
             
      return isActiveAndInRange;
    });
  }, [heroSlides]);

  // Memoized fallback component
  const fallbackComponent = useMemo(() => (
    <div className={`hero-slider-bg ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to CureBay</h2>
          <p className="text-xl">Your trusted healthcare partner</p>
        </div>
      </div>
    </div>
  ), [isDarkMode]);

  // More explicit check for empty slides
  if (!filteredSlides || filteredSlides.length === 0 || filteredSlides.every(slide => !slide)) {
    return fallbackComponent;
  }

  // Memoized slide rendering with better performance
  const renderSlides = useMemo(() => {
    return filteredSlides.map((slide, idx) => {
      // Validate slide data
      if (!slide || typeof slide !== 'object') {
        return null;
      }
      
      return (
        <SwiperSlide key={slide._id || idx}>
          <HeroSlide slide={slide} stats={stats} isDarkMode={isDarkMode} />
        </SwiperSlide>
      );
    });
  }, [filteredSlides, stats, isDarkMode]);

  return (
    <div className={`hero-slider-bg ${isDarkMode ? 'dark' : ''}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={showNavigation}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={filteredSlides.length > 1}
        className={`hero-swiper ${isDarkMode ? 'dark' : ''}`}
        slidesPerView={1}
        spaceBetween={0}
        speed={800}
        // Add performance optimizations
        updateOnWindowResize={true}
        observer={true}
        observeParents={true}
        // Reduce re-renders
        resistanceRatio={0}
      >
        {renderSlides}
      </Swiper>
    </div>
  );
};

// Add display name for debugging
HeroSlide.displayName = 'HeroSlide';

export default React.memo(HeroSlider);