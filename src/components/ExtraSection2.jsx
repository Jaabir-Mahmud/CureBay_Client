import React from 'react';
import { Shield, Truck, Clock, Award, Users, HeartHandshake } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const ExtraSection2 = () => {
  const features = [
    {
      id: 1,
      icon: Shield,
      title: 'Verified Quality',
      description: 'All medicines are sourced from licensed manufacturers and undergo strict quality checks.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and secure delivery to your doorstep with real-time tracking.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support and pharmacist consultation available.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and special offers for members.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 5,
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Over 50,000 satisfied customers trust us for their healthcare needs.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 6,
      icon: HeartHandshake,
      title: 'Expert Care',
      description: 'Professional pharmacists and healthcare experts to guide your choices.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '50,000+' },
    { label: 'Medicines Available', value: '10,000+' },
    { label: 'Partner Pharmacies', value: '500+' },
    { label: 'Cities Served', value: '100+' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CureBay?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best healthcare experience through quality, convenience, and care
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Trusted Healthcare Partner
            </h3>
            <p className="text-gray-600">
              Numbers that speak for our commitment to your health
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Experience Better Healthcare?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust CureBay for their medicine needs. 
              Start your journey to better health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
                Browse Medicines
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraSection2;

