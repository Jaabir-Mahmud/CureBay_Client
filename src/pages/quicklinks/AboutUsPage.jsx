import React from 'react';
import { Users, Award, Heart, Shield, Truck } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';

const AboutUsPage = () => {
  return (
    <>
      <SEOHelmet 
        title="About Us - CureBay Online Pharmacy"
        description="Learn more about CureBay, your trusted healthcare partner providing quality medicines and expert care since 2020."
        keywords="about CureBay, online pharmacy, healthcare, medicine delivery, trusted pharmacy"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              About CureBay
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Your trusted healthcare partner, providing quality medicines and expert care to help you live a healthier life.
            </p>
          </div>

          {/* Company Story */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                  Our Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  Founded in 2020, CureBay began with a simple mission: to make quality healthcare accessible to everyone. 
                  We recognized that accessing essential medicines and healthcare services should be convenient, affordable, 
                  and reliable for all.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  Today, we're proud to serve over 50,000 satisfied customers across the country with our extensive 
                  medicine catalog, expert consultation services, and fast delivery options. Our team of pharmacists 
                  and healthcare professionals work tirelessly to ensure you receive the best care possible.
                </p>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  We're committed to maintaining the highest standards of quality, safety, and customer service in 
                  everything we do. Your health is our priority.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl shadow-xl"></div>
                  <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Our Mission & Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                  Patient-Centered Care
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Everything we do is focused on improving your health and well-being. Your needs come first.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                  Quality Assurance
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  We ensure all our medicines are sourced from licensed manufacturers and undergo strict quality checks.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                  Fast & Reliable
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Quick and secure delivery to your doorstep with real-time tracking for peace of mind.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50,000+</div>
                <div className="text-cyan-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-cyan-100">Medicines Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-cyan-100">Partner Pharmacies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-cyan-100">Customer Support</div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Our Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full mx-auto mb-6 shadow-lg"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Jabir Mahmud
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 mb-3">Chief Medical Officer</p>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  15+ years in healthcare with expertise in pharmaceutical care and patient safety.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-6 shadow-lg"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                 Jabir Mahmud
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 mb-3">Chief Technology Officer</p>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Technology visionary with a passion for creating seamless healthcare experiences.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 shadow-lg"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Jabir Mahmud
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 mb-3">Head of Operations</p>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Operations expert focused on efficient delivery and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;