import React from 'react';
import { Heart, Activity, Stethoscope, Calendar, MapPin, Phone, CreditCard, Check } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';

const HealthCheckupPage = () => {
  const packages = [
    {
      name: "Basic Health Checkup",
      price: "৳79",
      originalPrice: "৳99",
      popular: false,
      features: [
        "Complete Blood Count (CBC)",
        "Blood Sugar (Fasting)",
        "Blood Pressure Check",
        "Height & Weight Measurement",
        "BMI Calculation",
        "Doctor Consultation",
        "Digital Report"
      ]
    },
    {
      name: "Comprehensive Health Checkup",
      price: "৳149",
      originalPrice: "৳199",
      popular: true,
      features: [
        "Complete Blood Count (CBC)",
        "Blood Sugar (Fasting & Post Prandial)",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Stimulating Hormone (TSH)",
        "Blood Pressure Check",
        "ECG",
        "Height & Weight Measurement",
        "BMI Calculation",
        "Doctor Consultation",
        "Digital Report"
      ]
    },
    {
      name: "Senior Citizen Checkup",
      price: "৳199",
      originalPrice: "৳249",
      popular: false,
      features: [
        "Complete Blood Count (CBC)",
        "Blood Sugar (Fasting & Post Prandial)",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Stimulating Hormone (TSH)",
        "Vitamin D & B12",
        "Blood Pressure Check",
        "ECG",
        "Chest X-Ray",
        "Height & Weight Measurement",
        "BMI Calculation",
        "Doctor Consultation",
        "Digital Report",
        "Dietary Advice"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Early Detection",
      description: "Identify potential health issues before they become serious problems."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health Monitoring",
      description: "Track changes in your health metrics over time for better management."
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Professional Assessment",
      description: "Get expert evaluation from qualified healthcare professionals."
    },
    {
      icon: <Check className="w-8 h-8" />,
      title: "Peace of Mind",
      description: "Regular checkups provide reassurance about your health status."
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Book Your Appointment",
      description: "Select a convenient date and time for your health checkup."
    },
    {
      step: "2",
      title: "Pre-Checkup Preparation",
      description: "Follow fasting instructions and other preparation guidelines."
    },
    {
      step: "3",
      title: "Complete Checkup",
      description: "Undergo all tests and examinations included in your package."
    },
    {
      step: "4",
      title: "Consultation & Report",
      description: "Meet with a doctor to discuss results and receive your report."
    }
  ];

  return (
    <>
      <SEOHelmet 
        title="Health Checkup Packages - CureBay"
        description="Comprehensive health checkup packages to monitor your health and detect potential issues early. Book your checkup today."
        keywords="health checkup, medical checkup, health screening, preventive healthcare, annual checkup"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-cyan-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Health Checkup Packages
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Comprehensive health checkup packages to monitor your health and detect potential issues early. 
              Invest in your health today for a better tomorrow.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Why Regular Health Checkups Matter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Our Health Checkup Packages
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    pkg.popular ? 'ring-2 ring-cyan-500 relative' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="bg-cyan-600 text-white text-center py-2 font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                      {pkg.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white mr-2 transition-colors">
                        {pkg.price}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through transition-colors">
                        {pkg.originalPrice}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 transition-colors">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        pkg.popular 
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      Book This Package
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              How It Works
            </h2>
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-12 right-12 h-1 bg-cyan-200 dark:bg-cyan-900/50"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preparation Guide */}
          <div className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 transition-colors">
              Preparation Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  Before Your Checkup
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">1</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Fast for 8-12 hours before blood tests (water allowed)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">2</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Avoid alcohol for 24 hours prior to the checkup
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">3</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Bring all current medications and supplements
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">4</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Wear comfortable clothing for easy access during examinations
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  On the Day of Your Checkup
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">1</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Arrive 15 minutes early to complete registration
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Bring a valid ID and your appointment confirmation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">3</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Inform staff of any allergies or medical conditions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">4</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Relax and follow instructions from our healthcare professionals
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Our Checkup Centers
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                      Main Health Center
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      306 Chapmans Lane<br />
                      San Ysidro, NM 87053<br />
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                      Contact Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Phone: +1 (555) 123-4567<br />
                      Email: checkups@curebay.com<br />
                      Emergency: +1 (555) 987-6543
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Payment Options
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                      Accepted Payment Methods
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      We accept all major credit cards, debit cards, and digital payments. 
                      Health insurance coverage varies by plan.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                      Appointment Scheduling
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Book your health checkup online or by phone. 
                      Same-day appointments may be available for urgent needs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Book Your Health Checkup
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-gradient-to-br from-cyan-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center transition-colors">
            <h2 className="text-3xl font-bold text-white mb-4 transition-colors">
              Have Questions About Health Checkups?
            </h2>
            <p className="text-cyan-100 dark:text-gray-200 text-lg mb-6 transition-colors">
              Our healthcare experts are ready to help you with any questions or concerns
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-cyan-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium transition-colors">
                Contact Support
              </Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 py-3 px-6 rounded-lg font-medium transition-colors">
                View FAQs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthCheckupPage;