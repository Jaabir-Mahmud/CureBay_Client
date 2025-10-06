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
  const [stats, setStats] = useState({ products: 300, customers: 900, support: 18 }); // Set initial values
  const showNavigation = heroSlides.length > 1;

  // Log the incoming data for debugging
  useEffect(() => {
    console.log('HeroSlider received heroSlides:', heroSlides);
  }, [heroSlides]);

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
    // Fetch stats with a more robust approach
    const fetchStats = async () => {
      try {
        console.log('Fetching stats data');
        
        // Try to fetch from the proper stats endpoint first
        try {
          const statsResponse = await fetch('/api/stats');
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log('Fetched stats data from /api/stats:', statsData);
            
            // Use actual data if available
            if (statsData.products !== undefined && statsData.customers !== undefined && statsData.support !== undefined) {
              setStats({
                products: statsData.products,
                customers: statsData.customers,
                support: statsData.support
              });
              return;
            }
          } else {
            console.log('Stats endpoint returned status:', statsResponse.status);
          }
        } catch (statsError) {
          console.log('Stats endpoint not accessible:', statsError);
        }
        
        // Fallback to medicines count (this endpoint works without auth)
        try {
          const medicinesResponse = await fetch('/api/medicines');
          
          if (medicinesResponse.ok) {
            const medicinesData = await medicinesResponse.json();
            console.log('Fetched medicines data:', medicinesData);
            
            // Get the total count from pagination info
            const products = medicinesData.pagination && medicinesData.pagination.total ? 
              medicinesData.pagination.total : 
              (medicinesData.medicines ? medicinesData.medicines.length : 0);
            
            // Use conservative estimates based on actual product count
            // Since we know there are only 2 users, we'll use that as a base
            const customers = 2;
            const support = Math.max(1, Math.floor(customers * 0.1)); // 10% of users have support tickets
            
            console.log('Using estimated stats - Products:', products, 'Customers (known):', customers, 'Support (estimated):', support);
            
            // Update state with the calculated values
            setStats({
              products: products,
              customers: customers,
              support: support
            });
            return;
          }
        } catch (medicinesError) {
          console.log('Medicines endpoint not accessible:', medicinesError);
        }
        
        // Final fallback - use known values
        console.log('Using final fallback values');
        setStats({
          products: 300,
          customers: 2,
          support: 1
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use minimal fallback values
        setStats({
          products: 300,
          customers: 2,
          support: 1
        });
      }
    };
    
    fetchStats();
  }, []);

  // Log stats for debugging
  useEffect(() => {
    console.log('Stats updated:', stats);
  }, [stats]);

  // Filter slides based on date range - less aggressive filtering
  const filteredSlides = heroSlides.filter(slide => {
    // Validate slide data
    if (!slide || typeof slide !== 'object') {
      console.log('Skipping invalid slide:', slide);
      return false;
    }
    
    // Check for required fields
    if (!slide.title || !slide.description) {
      console.log('Skipping slide with missing required fields:', slide);
      return false;
    }
    
    // Only filter out slides that are clearly seed data
    // Let's be very specific about what we consider seed data
    const isClearlySeedData = 
      slide.title === "Summer Health Essentials" && 
      slide.subtitle === "Stay Healthy This Summer" &&
      slide.description.includes("curated selection");
    
    if (isClearlySeedData) {
      console.log('Filtering out clearly seed data slide:', slide.title);
      return false;
    }
    
    const now = new Date();
    const startDate = slide.startDate ? new Date(slide.startDate) : null;
    const endDate = slide.endDate ? new Date(slide.endDate) : null;
    
    // Check if slide is active and within date range (respecting project specifications)
    const isActiveAndInRange = slide.active && 
           (!startDate || now >= startDate) && 
           (!endDate || now <= endDate);
           
    console.log('Slide evaluation:', { title: slide.title, active: slide.active, isActiveAndInRange });
    return isActiveAndInRange;
  });

  // Log the final filtered slides count
  console.log('Final filtered slides count:', filteredSlides.length);
  console.log('Filtered slides data:', filteredSlides);

  // More explicit check for empty slides
  if (!filteredSlides || filteredSlides.length === 0 || filteredSlides.every(slide => !slide)) {
    console.log('Showing fallback message as no valid slides found');
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
          if (!slide || typeof slide !== 'object') {
            console.log('Skipping invalid slide in render:', slide);
            return null;
          }
          
          // Ensure we have basic data
          const title = slide.title || 'Untitled Slide';
          const description = slide.description || 'No description available';
          
          console.log('Rendering slide:', { slide, title, description });
          
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
                              (slide.featured.medicine.description.length > 100 ? 
                                slide.featured.medicine.description.substring(0, 100) + "..." : 
                                slide.featured.medicine.description) : 
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