import React, { useState } from 'react';
import { 
  TestTube, 
  Microscope, 
  Heart, 
  Activity, 
  Droplets, 
  Zap, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  Search,
  Filter
} from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useLanguage } from '../../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../../lib/i18n'; // Added translation import

const LabTestsPage = () => {
  const { language } = useLanguage(); // Use language context
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [email, setEmail] = useState(''); // Added state for email input
  const [isSubscribed, setIsSubscribed] = useState(false); // Added state for subscription status

  const categories = [
    { id: 'all', name: 'All Tests', icon: <TestTube className="w-5 h-5" /> },
    { id: 'blood', name: 'Blood Tests', icon: <Droplets className="w-5 h-5" /> },
    { id: 'urine', name: 'Urine Tests', icon: <Activity className="w-5 h-5" /> },
    { id: 'hormone', name: 'Hormone Tests', icon: <Zap className="w-5 h-5" /> },
    { id: 'cardiac', name: 'Cardiac Tests', icon: <Heart className="w-5 h-5" /> },
    { id: 'infection', name: 'Infection Tests', icon: <Microscope className="w-5 h-5" /> }
  ];

  const labTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "blood",
      price: "৳29",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Measures various components and features of your blood to assess overall health and detect disorders.",
      preparation: "No special preparation required"
    },
    {
      id: 2,
      name: "Blood Glucose (Fasting)",
      category: "blood",
      price: "৳19",
      sample: "Blood",
      turnaround: "Same day",
      description: "Measures blood sugar levels after fasting to diagnose diabetes or monitor glucose control.",
      preparation: "8-12 hours fasting required"
    },
    {
      id: 3,
      name: "Lipid Profile",
      category: "blood",
      price: "৳39",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Measures cholesterol and triglyceride levels to assess cardiovascular disease risk.",
      preparation: "9-12 hours fasting required"
    },
    {
      id: 4,
      name: "Thyroid Function Test (TSH)",
      category: "hormone",
      price: "৳35",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Measures thyroid-stimulating hormone levels to evaluate thyroid function.",
      preparation: "No special preparation required"
    },
    {
      id: 5,
      name: "Liver Function Test",
      category: "blood",
      price: "৳45",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Assesses liver health by measuring enzymes, proteins, and bilirubin in your blood.",
      preparation: "No special preparation required"
    },
    {
      id: 6,
      name: "Kidney Function Test",
      category: "blood",
      price: "৳42",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Evaluates how well your kidneys are working by measuring waste products in your blood.",
      preparation: "No special preparation required"
    },
    {
      id: 7,
      name: "Urinalysis",
      category: "urine",
      price: "৳25",
      sample: "Urine",
      turnaround: "Same day",
      description: "Analyzes urine to detect and manage disorders of the urinary system.",
      preparation: "First morning urine sample preferred"
    },
    {
      id: 8,
      name: "Vitamin D",
      category: "hormone",
      price: "৳49",
      sample: "Blood",
      turnaround: "48 hours",
      description: "Measures vitamin D levels to assess bone health and immune function.",
      preparation: "No special preparation required"
    },
    {
      id: 9,
      name: "Vitamin B12",
      category: "hormone",
      price: "৳45",
      sample: "Blood",
      turnaround: "48 hours",
      description: "Measures vitamin B12 levels to detect deficiency or excess.",
      preparation: "No special preparation required"
    },
    {
      id: 10,
      name: "Hemoglobin A1C",
      category: "blood",
      price: "৳32",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Measures average blood glucose levels over the past 2-3 months.",
      preparation: "No special preparation required"
    },
    {
      id: 11,
      name: "C-Reactive Protein (CRP)",
      category: "blood",
      price: "৳38",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Measures inflammation levels in the body to assess cardiovascular risk.",
      preparation: "No special preparation required"
    },
    {
      id: 12,
      name: "Prothrombin Time (PT/INR)",
      category: "blood",
      price: "৳41",
      sample: "Blood",
      turnaround: "24 hours",
      description: "Measures how long it takes blood to clot, especially for those on blood thinners.",
      preparation: "No special preparation required"
    }
  ];

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const features = [
    {
      icon: <TestTube className="w-8 h-8" />,
      title: "Accurate Results",
      description: "State-of-the-art laboratory equipment ensures precise and reliable test results."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Fast Turnaround",
      description: "Most test results available within 24-48 hours, with expedited options available."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Convenient Locations",
      description: "Multiple collection centers for your convenience with home collection available."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Expert Support",
      description: "Our certified lab professionals are available to answer your questions."
    }
  ];

  // Added function to handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real application, you would send this to your backend
      console.log(`Subscribed with email: ${email}`);
      setIsSubscribed(true);
      setEmail('');
      // Reset the subscription status after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <>
      <SEOHelmet 
        title="Lab Tests & Diagnostic Services - CureBay"
        description="Comprehensive laboratory testing services with fast results and convenient home collection. Book your lab tests online."
        keywords="lab tests, diagnostic tests, blood tests, urine tests, laboratory services, medical tests"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Microscope className="w-12 h-12 text-cyan-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Lab Tests & Diagnostic Services
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Comprehensive laboratory testing services with fast results and convenient home collection. 
              Book your lab tests online and get accurate results delivered to your healthcare provider.
            </p>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Why Choose Our Lab Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search lab tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg w-full"
                />
              </div>
              
              <div className="flex items-center">
                <Filter className="text-gray-400 w-5 h-5 mr-2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Showing {filteredTests.length} of {labTests.length} lab tests
            </p>
          </div>

          {/* Lab Tests Grid */}
          {filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredTests.map((test) => (
                <div key={test.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded-full text-sm font-medium mb-2 transition-colors">
                          {getCategoryName(test.category)}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                          {test.name}
                        </h3>
                      </div>
                      <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 transition-colors">
                        {test.price}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                      {test.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        <Droplets className="w-4 h-4 mr-2" />
                        <span>Sample: {test.sample}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Turnaround: {test.turnaround}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        <Activity className="w-4 h-4 mr-2" />
                        <span>Preparation: {test.preparation}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-medium transition-colors">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-16 transition-colors">
              <TestTube className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                No lab tests found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              How Our Lab Services Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors">
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                  Book Your Tests
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Select the tests you need and choose a convenient time for sample collection.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                  Sample Collection
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Visit our lab or opt for home collection at your convenience.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                  Receive Results
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Get your detailed lab reports within 24-48 hours delivered securely.
                </p>
              </div>
            </div>
          </div>

          {/* Collection Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Lab Collection Centers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                      Main Lab Center
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      1216 Dhaka<br />
                      Bangladesh<br />
                      Monday - Saturday: 7:00 AM - 6:00 PM<br />
                      Sunday: 8:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                      Contact Information
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Phone: +880 1571151277  <br />
                      Email: lab@curebay.com<br />
                      Emergency: +880 1571151278
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Home Collection Service
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                Our certified phlebotomists will visit your home for sample collection at your convenience. 
                Available for orders over $50.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Available 7 days a week</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Morning and evening slots</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Results delivered within 24-48 hours</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                Schedule Home Collection
              </Button>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-gradient-to-br from-cyan-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center transition-colors">
            <h2 className="text-3xl font-bold text-white mb-4 transition-colors">
              Have Questions About Lab Tests?
            </h2>
            <p className="text-cyan-100 dark:text-gray-200 text-lg mb-6 transition-colors">
              Our laboratory experts are available to help you understand which tests you need
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-cyan-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium transition-colors">
                Contact Lab Support
              </Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 py-3 px-6 rounded-lg font-medium transition-colors">
                View Test Preparation Guide
              </Button>
            </div>
          </div>

          {/* Stay Updated with CureBay - Newsletter Subscription */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8 text-center mt-16 transition-colors">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                {t('footer.stayUpdated', language)}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 transition-colors">
                {t('footer.stayUpdatedDescription', language)}
              </p>
              
              {isSubscribed ? (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 transition-colors">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Thank you for subscribing! You'll receive updates from CureBay.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder={t('footer.emailPlaceholder', language)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-cyan-500 dark:bg-white/10 dark:text-white dark:placeholder-gray-300"
                    required
                  />
                  <Button 
                    type="submit"
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                  >
                    {t('footer.subscribe', language)}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabTestsPage;