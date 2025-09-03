import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCards, Thumbs, FreeMode } from 'swiper/modules';
import { ShoppingCart, Star, Tag, Heart, Eye, Clock, TrendingDown, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const DiscountSection = () => {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'featured'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [wishlist, setWishlist] = useState(new Set());

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  // Enhanced discount products with more realistic data
  const discountProducts = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      company: 'PharmaCorp',
      originalPrice: 25.99,
      discountPrice: 19.99,
      discount: 23,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format',
      category: 'Tablets',
      inStock: true,
      description: 'Effective pain relief and fever reducer for adults and children',
      genericName: 'Acetaminophen',
      massUnit: '500mg',
      isFlashSale: true,
      flashSaleEnds: '2024-12-31T23:59:59Z',
      soldCount: 89,
      totalStock: 150,
      tags: ['Pain Relief', 'Fever', 'Fast Acting']
    },
    {
      id: 2,
      name: 'Cough Syrup 100ml',
      company: 'MediCare',
      originalPrice: 18.50,
      discountPrice: 12.99,
      discount: 30,
      rating: 4.2,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format',
      category: 'Syrups',
      inStock: true,
      description: 'Natural cough relief formula with honey and herbal extracts',
      genericName: 'Dextromethorphan',
      massUnit: '100ml',
      isFlashSale: false,
      soldCount: 67,
      totalStock: 200,
      tags: ['Cough Relief', 'Natural', 'Herbal']
    },
    {
      id: 3,
      name: 'Vitamin D3 Capsules',
      company: 'HealthPlus',
      originalPrice: 32.00,
      discountPrice: 24.99,
      discount: 22,
      rating: 4.7,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      category: 'Supplements',
      inStock: true,
      description: 'Essential vitamin for bone health and immune system support',
      genericName: 'Cholecalciferol',
      massUnit: '1000 IU',
      isFlashSale: true,
      flashSaleEnds: '2024-12-31T23:59:59Z',
      soldCount: 134,
      totalStock: 300,
      tags: ['Immunity', 'Bone Health', 'Vitamin D']
    },
    {
      id: 4,
      name: 'Antibiotic Capsules',
      company: 'BioMed',
      originalPrice: 45.99,
      discountPrice: 34.99,
      discount: 24,
      rating: 4.3,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format',
      category: 'Capsules',
      inStock: true,
      description: 'Broad spectrum antibiotic treatment for bacterial infections',
      genericName: 'Amoxicillin',
      massUnit: '500mg',
      isFlashSale: false,
      soldCount: 45,
      totalStock: 120,
      tags: ['Antibiotic', 'Prescription', 'Bacterial']
    },
    {
      id: 5,
      name: 'Pain Relief Gel',
      company: 'TopicalCare',
      originalPrice: 22.99,
      discountPrice: 16.99,
      discount: 26,
      rating: 4.4,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format',
      category: 'Others',
      inStock: true,
      description: 'Fast-acting topical pain relief gel for muscle and joint pain',
      genericName: 'Diclofenac',
      massUnit: '50g',
      isFlashSale: false,
      soldCount: 78,
      totalStock: 180,
      tags: ['Topical', 'Pain Relief', 'Muscle']
    },
    {
      id: 6,
      name: 'Multivitamin Tablets',
      company: 'VitaLife',
      originalPrice: 28.99,
      discountPrice: 21.99,
      discount: 24,
      rating: 4.6,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format',
      category: 'Tablets',
      inStock: false,
      description: 'Complete daily nutrition support with essential vitamins and minerals',
      genericName: 'Multivitamin Complex',
      massUnit: '30 tablets',
      isFlashSale: false,
      soldCount: 156,
      totalStock: 0,
      tags: ['Multivitamin', 'Daily Health', 'Complete']
    },
    {
      id: 7,
      name: 'Omega-3 Fish Oil',
      company: 'MarineHealth',
      originalPrice: 39.99,
      discountPrice: 29.99,
      discount: 25,
      rating: 4.8,
      reviews: 324,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      category: 'Supplements',
      inStock: true,
      description: 'Premium fish oil capsules for heart and brain health',
      genericName: 'Omega-3 Fatty Acids',
      massUnit: '1000mg',
      isFlashSale: true,
      flashSaleEnds: '2024-12-31T23:59:59Z',
      soldCount: 267,
      totalStock: 400,
      tags: ['Heart Health', 'Brain Health', 'Premium']
    },
    {
      id: 8,
      name: 'Insulin Pen',
      company: 'DiabetCare',
      originalPrice: 85.99,
      discountPrice: 69.99,
      discount: 19,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format',
      category: 'Injections',
      inStock: true,
      description: 'Fast-acting insulin pen for diabetes management',
      genericName: 'Human Insulin',
      massUnit: '100 units/ml',
      isFlashSale: false,
      soldCount: 34,
      totalStock: 75,
      tags: ['Diabetes', 'Insulin', 'Fast Acting']
    }
  ];

  const handleAddToCart = (product) => {
    // Add to cart logic here
    console.log('Adding to cart:', product);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const getStockPercentage = (sold, total) => {
    return total > 0 ? (sold / total) * 100 : 0;
  };

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  const ProductModal = ({ product }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{product.name}</DialogTitle>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Badge variant="outline">{product.category}</Badge>
            <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">by {product.company}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{product.rating}</span>
            </div>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>

          <div className="space-y-2">
            <p><strong>Generic Name:</strong> {product.genericName}</p>
            <p><strong>Strength:</strong> {product.massUnit}</p>
            <p><strong>Description:</strong> {product.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">${product.discountPrice}</span>
            <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            <Badge className="bg-red-500">-{product.discount}%</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sold: {product.soldCount}</span>
              <span>Stock: {product.totalStock - product.soldCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStockPercentage(product.soldCount, product.totalStock)}%` }}
              ></div>
            </div>
          </div>

          <Button
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-500 p-3 rounded-full mr-4">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Flash Sale
              </h2>
              <div className="flex items-center justify-center mt-2">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-red-600 font-semibold">Up to 30% OFF</span>
              </div>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-md mx-auto mb-8 transition-colors duration-300">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">Flash Sale Ends In</span>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
                  <span className="text-2xl font-bold">{formatTime(timeLeft.hours)}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Hours</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 text-2xl font-bold">:</span>
              </div>
              <div className="text-center">
                <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
                  <span className="text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 text-2xl font-bold">:</span>
              </div>
              <div className="text-center">
                <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
                  <span className="text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Seconds</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Save big on quality medicines with our limited-time offers. Don't miss out!
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="discount-swiper"
        >
          {discountProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    
                    {/* Flash Sale Indicator */}
                    {product.isFlashSale && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse border-0 shadow-lg">
                          <Zap className="w-3 h-3 mr-1" />
                          FLASH SALE
                        </Badge>
                      </div>
                    )}

                    {/* Discount Badge */}
                    <div className={`absolute ${product.isFlashSale ? 'top-12' : 'top-3'} left-3 z-10`}>
                      <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-lg">
                        -{product.discount}%
                      </Badge>
                    </div>

                    {/* Wishlist and Quick View */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 rounded-full transition-all duration-300 shadow-lg ${
                          wishlist.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            wishlist.has(product.id) ? 'fill-current' : ''
                          }`} 
                        />
                      </button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-2 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 shadow-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <ProductModal product={product} />
                      </Dialog>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <Badge 
                        variant={product.inStock ? "default" : "secondary"}
                        className={`${product.inStock ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"} shadow-lg`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 rounded-t-lg" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <Badge variant="outline" className="mb-2 text-xs">
                      {product.category}
                    </Badge>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Company */}
                    <p className="text-sm text-gray-600 mb-2">
                      by {product.company}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Stock Progress Bar */}
                    {product.inStock && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Sold: {product.soldCount}</span>
                          <span>Available: {product.totalStock - product.soldCount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${getStockPercentage(product.soldCount, product.totalStock)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(getStockPercentage(product.soldCount, product.totalStock))}% sold
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-blue-600">
                            ${product.discountPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Save ${(product.originalPrice - product.discountPrice).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-300 hover:shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleWishlist(product.id)}
                        className={`transition-all duration-300 ${
                          wishlist.has(product.id)
                            ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            wishlist.has(product.id) ? 'fill-current' : ''
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Discounts Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          >
            <Tag className="w-5 h-5 mr-2" />
            View All Discounts
          </Button>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .discount-swiper .swiper-button-next,
          .discount-swiper .swiper-button-prev {
            color: #2563eb;
            background: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .discount-swiper .swiper-button-next:after,
          .discount-swiper .swiper-button-prev:after {
            font-size: 16px;
            font-weight: bold;
          }

          .discount-swiper .swiper-pagination-bullet {
            background: #2563eb;
            opacity: 0.3;
          }

          .discount-swiper .swiper-pagination-bullet-active {
            opacity: 1;
          }

          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </section>
  );
};

export default DiscountSection;

