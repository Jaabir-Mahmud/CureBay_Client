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

  // Mock data for admin-managed slides - this would come from API
  const mockSlides = [
    {
      id: 1,
      title: 'Quality Healthcare Solutions',
      subtitle: 'Your trusted partner for medical needs',
      description: 'Discover our comprehensive range of medicines and healthcare products with verified quality and competitive pricing.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop&auto=format',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      isActive: true,
      backgroundColor: 'from-blue-600 to-blue-800',
      textColor: 'text-white',
      featured: {
        medicine: {
          name: 'Paracetamol 500mg',
          price: 19.99,
          originalPrice: 25.99,
          discount: 23,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&auto=format'
        }
      }
    },
    {
      id: 2,
      title: 'Premium Vitamins & Supplements',
      subtitle: 'Boost your immunity naturally',
      description: 'Explore our premium collection of vitamins and supplements to support your daily health and wellness journey.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop&auto=format',
      buttonText: 'Browse Supplements',
      buttonLink: '/category/supplements',
      isActive: true,
      backgroundColor: 'from-green-600 to-green-800',
      textColor: 'text-white',
      featured: {
        medicine: {
          name: 'Vitamin D3 1000 IU',
          price: 24.99,
          originalPrice: 32.00,
          discount: 22,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format'
        }
      }
    },
    {
      id: 3,
      title: 'Fast & Reliable Delivery',
      subtitle: 'Get your medicines delivered safely',
      description: 'Experience our quick delivery service with proper packaging and temperature control for all your medical needs.',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=600&fit=crop&auto=format',
      buttonText: 'Learn More',
      buttonLink: '/about',
      isActive: true,
      backgroundColor: 'from-purple-600 to-purple-800',
      textColor: 'text-white',
      featured: {
        medicine: {
          name: 'Insulin Pen',
          price: 45.99,
          originalPrice: 52.00,
          discount: 12,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&auto=format'
        }
      }
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch admin-managed slides
    const fetchSlides = async () => {
      try {
        setLoading(true);
        // In real implementation, this would be:
        // const response = await fetch('/api/admin/hero-slides');
        // const data = await response.json();
        // setSlides(data.filter(slide => slide.isActive));
        
        // For now, use mock data
        setTimeout(() => {
          setSlides(mockSlides.filter(slide => slide.isActive));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
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
          <span className="text-2xl font-bold text-blue-600">${medicine.price}</span>
          {medicine.originalPrice && (
            <span className="text-lg text-gray-500 line-through">${medicine.originalPrice}</span>
          )}
          {medicine.discount && (
            <Badge className="bg-red-500">-{medicine.discount}%</Badge>
          )}
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="relative h-[600px] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading slides...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to CureBay</h2>
          <p className="text-gray-300 mb-6">Your trusted healthcare partner</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className={`relative h-full bg-gradient-to-r ${slide.backgroundColor} overflow-hidden`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                  {/* Left Content */}
                  <div className={`space-y-6 ${slide.textColor}`}>
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
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium"
                      >
                        {slide.buttonText}
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-medium"
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
                      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
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
                          />
                          
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {slide.featured.medicine.name}
                            </h3>
                            
                            <div className="flex items-center justify-center space-x-1 mb-3">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">
                                {slide.featured.medicine.rating}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-2 mb-4">
                              <span className="text-xl font-bold text-blue-600">
                                ${slide.featured.medicine.price}
                              </span>
                              {slide.featured.medicine.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${slide.featured.medicine.originalPrice}
                                </span>
                              )}
                              {slide.featured.medicine.discount && (
                                <Badge className="bg-red-100 text-red-700 text-xs">
                                  -{slide.featured.medicine.discount}%
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
                              
                              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
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
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button className="hero-slider-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="hero-slider-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .hero-slider .swiper-pagination {
          bottom: 20px;
        }
        .hero-slider .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          width: 12px;
          height: 12px;
        }
        .hero-slider .swiper-pagination-bullet-active {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;