import React from 'react';
import { 
  HelpCircle, 
  User, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Truck, 
  Shield, 
  Phone, 
  Mail,
  FileText,
  RotateCcw,
  MapPin
} from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';

const HelpCenterPage = () => {
  const helpTopics = [
    {
      category: "Account Management",
      icon: <User className="w-6 h-6" />,
      topics: [
        {
          title: "Creating an Account",
          description: "Learn how to create your CureBay account and set up your profile.",
          link: "#"
        },
        {
          title: "Updating Your Information",
          description: "How to update your personal details, shipping address, and payment methods.",
          link: "#"
        },
        {
          title: "Password Reset",
          description: "Steps to reset your password if you've forgotten it.",
          link: "#"
        }
      ]
    },
    {
      category: "Ordering Process",
      icon: <ShoppingCart className="w-6 h-6" />,
      topics: [
        {
          title: "Placing an Order",
          description: "A step-by-step guide to ordering medicines and health products.",
          link: "#"
        },
        {
          title: "Order Modifications",
          description: "How to modify or cancel your order before it ships.",
          link: "#"
        },
        {
          title: "Order Confirmation",
          description: "Understanding your order confirmation and what to expect.",
          link: "#"
        }
      ]
    },
    {
      category: "Prescriptions",
      icon: <FileText className="w-6 h-6" />,
      topics: [
        {
          title: "Submitting Prescriptions",
          description: "How to upload or send your prescriptions to us.",
          link: "#"
        },
        {
          title: "Prescription Transfer",
          description: "Transferring prescriptions from other pharmacies.",
          link: "#"
        },
        {
          title: "Refill Requests",
          description: "Setting up automatic refills for your regular medications.",
          link: "#"
        }
      ]
    },
    {
      category: "Payment & Billing",
      icon: <CreditCard className="w-6 h-6" />,
      topics: [
        {
          title: "Payment Methods",
          description: "Accepted payment options and how to use them.",
          link: "#"
        },
        {
          title: "Insurance Coverage",
          description: "How to use your health insurance with our services.",
          link: "#"
        },
        {
          title: "Billing Issues",
          description: "Resolving billing discrepancies and payment problems.",
          link: "#"
        }
      ]
    },
    {
      category: "Delivery & Returns",
      icon: <Truck className="w-6 h-6" />,
      topics: [
        {
          title: "Delivery Options",
          description: "Available delivery methods and estimated delivery times.",
          link: "#"
        },
        {
          title: "Tracking Your Order",
          description: "How to track your shipment and get delivery updates.",
          link: "#"
        },
        {
          title: "Return Policy",
          description: "Our return policy and how to initiate a return.",
          link: "#"
        }
      ]
    },
    {
      category: "Security & Privacy",
      icon: <Shield className="w-6 h-6" />,
      topics: [
        {
          title: "Account Security",
          description: "Tips to keep your account secure and protect your information.",
          link: "#"
        },
        {
          title: "Privacy Policy",
          description: "How we protect your personal and medical information.",
          link: "/privacy-policy"
        },
        {
          title: "Phishing Prevention",
          description: "How to identify and avoid fraudulent communications.",
          link: "#"
        }
      ]
    }
  ];

  return (
    <>
      <SEOHelmet 
        title="Help Center - CureBay Online Pharmacy"
        description="Get help with your CureBay account, orders, prescriptions, and more. Browse our help topics or contact support."
        keywords="help center, customer support, pharmacy help, medicine delivery help"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-12 h-12 text-cyan-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Help Center
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Find answers to your questions and get help with our services
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help topics..."
                className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-800 dark:text-white transition-colors"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Help Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {helpTopics.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-3">{category.icon}</span>
                    {category.category}
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>
                        <a 
                          href={topic.link} 
                          className="block group"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">
                            {topic.description}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-colors">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Still Need Help?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors">
                Our support team is available 24/7 to assist you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md transition-colors">
                <Phone className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Phone Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                  Call us anytime for immediate assistance
                </p>
                <a 
                  href="tel:+15551234567" 
                  className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md transition-colors">
                <Mail className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Email Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                  Send us a message and we'll respond quickly
                </p>
                <a 
                  href="mailto:support@curebay.com" 
                  className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
                >
                  support@curebay.com
                </a>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md transition-colors">
                <MapPin className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Visit Us
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                  Visit our location for in-person assistance
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  306 Chapmans Lane<br />
                  San Ysidro, NM 87053
                </p>
              </div>
            </div>
          </div>

          {/* Self-Service Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
              <div className="flex items-start mb-6">
                <RotateCcw className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    Order Status
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    Track your orders and view delivery information
                  </p>
                </div>
              </div>
              <a 
                href="/profile" 
                className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                Check Order Status
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
              <div className="flex items-start mb-6">
                <User className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    Account Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    Manage your profile, addresses, and preferences
                  </p>
                </div>
              </div>
              <a 
                href="/profile" 
                className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                Manage Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenterPage;