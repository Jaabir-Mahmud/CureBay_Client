import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ShoppingCart, Star, Tag } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DiscountSection = () => {
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
      description: 'Effective pain relief and fever reducer'
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
      description: 'Natural cough relief formula'
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
      description: 'Essential vitamin for bone health'
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
      description: 'Broad spectrum antibiotic treatment'
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
      description: 'Fast-acting topical pain relief'
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
      description: 'Complete daily nutrition support'
    }
  ];

  const handleAddToCart = (product) => {
    // Add to cart logic here
    console.log('Adding to cart:', product);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Tag className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Special Discounts
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Save big on quality medicines with our limited-time offers
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
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        -{product.discount}%
                      </Badge>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={product.inStock ? "default" : "secondary"}
                        className={product.inStock ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
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

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.discountPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
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
      <style jsx global>{`
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
      `}</style>
    </section>
  );
};

export default DiscountSection;

