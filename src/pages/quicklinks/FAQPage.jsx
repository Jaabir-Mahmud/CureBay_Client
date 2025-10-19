import React, { useState } from 'react';
import { ChevronDown, Package, CreditCard, Truck, Shield, Phone, Search } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      category: "Ordering & Delivery",
      icon: <Package className="w-5 h-5" />,
      color: "from-cyan-500 to-cyan-600",
      questions: [
        {
          question: "How do I place an order?",
          answer: "You can place an order by browsing our medicine catalog, adding items to your cart, and proceeding to checkout. You'll need to create an account or log in if you already have one."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payment methods like PayPal and Apple Pay."
        },
        {
          question: "How long does delivery take?",
          answer: "Standard delivery typically takes 2-3 business days. Express delivery is available for an additional fee and can deliver within 24 hours in select areas."
        },
        {
          question: "Can I track my order?",
          answer: "Yes, once your order has been shipped, you'll receive a tracking number via email that you can use to monitor your delivery status."
        }
      ]
    },
    {
      category: "Prescriptions",
      icon: <CreditCard className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      questions: [
        {
          question: "Do you require prescriptions for all medications?",
          answer: "We require valid prescriptions for all prescription medications. You can upload your prescription during checkout or send it to us via email or fax."
        },
        {
          question: "How do I submit a prescription?",
          answer: "You can upload your prescription during the checkout process, email it to prescriptions@curebay.com, or fax it to +1 (555) 123-4568."
        },
        {
          question: "Can I use a prescription from another pharmacy?",
          answer: "Yes, we can transfer prescriptions from other pharmacies. Simply provide us with the details of your current prescription and pharmacy."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      icon: <Truck className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      questions: [
        {
          question: "What is your return policy?",
          answer: "Due to health and safety regulations, prescription medications cannot be returned. Unopened over-the-counter products can be returned within 30 days of purchase with original packaging."
        },
        {
          question: "How do I request a refund?",
          answer: "For eligible returns, contact our customer service team at support@curebay.com with your order number and reason for return. We'll provide instructions for returning the item."
        }
      ]
    },
    {
      category: "Account & Security",
      icon: <Shield className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Click on the 'Forgot Password' link on the login page and enter your email address. We'll send you a link to reset your password."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we use industry-standard encryption to protect your personal and payment information. We never share your data with third parties without your consent."
        }
      ]
    },
    {
      category: "General Support",
      icon: <Phone className="w-5 h-5" />,
      color: "from-pink-500 to-pink-600",
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "You can reach our customer support team by phone at +1 (555) 123-4567, email at support@curebay.com, or through our contact form. We're available 24/7 to assist you."
        },
        {
          question: "Do you offer consultations with pharmacists?",
          answer: "Yes, our certified pharmacists are available for consultation. You can schedule a consultation through your account or by calling our support line."
        }
      ]
    }
  ];

  // Filter FAQ data based on search term
  const filteredFaqData = searchTerm 
    ? faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqData;

  return (
    <>
      <SEOHelmet 
        title="Frequently Asked Questions - CureBay Online Pharmacy"
        description="Find answers to common questions about ordering medicines, delivery, prescriptions, and more at CureBay."
        keywords="FAQ, frequently asked questions, pharmacy FAQ, medicine delivery FAQ"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Find answers to common questions about our services
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for questions..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 shadow-lg"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqData.length > 0 ? (
              filteredFaqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className={`bg-gradient-to-r ${category.color} p-6`}>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="mr-3">{category.icon}</span>
                      {category.category}
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {category.questions.map((item, index) => {
                      const globalIndex = `${categoryIndex}-${index}`;
                      return (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 py-6">
                          <button
                            className="flex justify-between items-start w-full text-left group"
                            onClick={() => toggleFAQ(globalIndex)}
                          >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-4 transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                              {item.question}
                            </h3>
                            <ChevronDown 
                              className={`flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-300 ${
                                openIndex === globalIndex ? 'transform rotate-180' : ''
                              }`} 
                            />
                          </button>
                          
                          {openIndex === globalIndex && (
                            <div className="mt-4 pl-2 text-gray-600 dark:text-gray-300 transition-all duration-300 animate-fadeIn">
                              <p>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We couldn't find any FAQs matching your search. Try different keywords.
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Still Need Help */}
          <div className="mt-16 bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl shadow-xl p-8 text-center transition-all duration-300 hover:shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Still Need Help?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg transition-colors">
                Can't find the answer you're looking for? Our support team is here to help 24/7.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="/contact" 
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Contact Us
                </a>
                <a 
                  href="tel:+15551234567" 
                  className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 font-medium border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Call +880 1571151277
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default FAQPage;