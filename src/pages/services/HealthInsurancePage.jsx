import React, { useState } from 'react';
import { 
  Shield, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail,
  FileText,
  CreditCard
} from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';

const HealthInsurancePage = () => {
  const [activeTab, setActiveTab] = useState('providers');

  const insuranceProviders = [
    {
      id: 1,
      name: "Blue Cross Blue Shield",
      logo: "https://placehold.co/150x50?text=BCBS",
      accepted: true,
      coverage: "Full coverage for prescription medications with prior authorization"
    },
    {
      id: 2,
      name: "UnitedHealthcare",
      logo: "https://placehold.co/150x50?text=UHC",
      accepted: true,
      coverage: "80% coverage for prescription medications after deductible"
    },
    {
      id: 3,
      name: "Aetna",
      logo: "https://placehold.co/150x50?text=Aetna",
      accepted: true,
      coverage: "Co-pay based coverage for most medications"
    },
    {
      id: 4,
      name: "Cigna",
      logo: "https://placehold.co/150x50?text=Cigna",
      accepted: true,
      coverage: "Tier-based pricing with varying co-pays"
    },
    {
      id: 5,
      name: "Humana",
      logo: "https://placehold.co/150x50?text=Humana",
      accepted: true,
      coverage: "Standard prescription coverage with formulary restrictions"
    },
    {
      id: 6,
      name: "Medicare",
      logo: "https://placehold.co/150x50?text=Medicare",
      accepted: true,
      coverage: "Part D prescription coverage with deductible"
    }
  ];

  const faqs = [
    {
      question: "How do I know if my insurance is accepted?",
      answer: "We accept most major insurance providers. You can check our list of accepted insurers or contact our insurance team for confirmation."
    },
    {
      question: "What if my insurance isn't listed?",
      answer: "We may still be able to process your insurance. Contact our insurance specialists to verify coverage for your specific plan."
    },
    {
      question: "Do I need prior authorization for prescriptions?",
      answer: "Some medications require prior authorization from your insurance provider. Our pharmacists will handle this process for you."
    },
    {
      question: "How do I submit claims to my insurance?",
      answer: "We can submit claims directly to your insurance provider. Just provide your insurance information at checkout."
    },
    {
      question: "What if my claim is denied?",
      answer: "Our insurance team will work with your provider to appeal denied claims and explore alternative coverage options."
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Cost Savings",
      description: "Reduce out-of-pocket expenses by using your insurance coverage for medications."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Comprehensive Coverage",
      description: "Access to a wide range of medications covered under your insurance plan."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Assistance",
      description: "Our insurance specialists help navigate complex coverage requirements."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Streamlined Process",
      description: "We handle the insurance paperwork so you don't have to."
    }
  ];

  return (
    <>
      <SEOHelmet 
        title="Health Insurance - CureBay Online Pharmacy"
        description="Use your health insurance to cover prescription medications. We work with major insurance providers to maximize your coverage."
        keywords="health insurance, prescription coverage, insurance providers, medicare, medicare part d"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-cyan-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Health Insurance
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Use your health insurance to cover prescription medications. 
              We work with major insurance providers to maximize your coverage and minimize your out-of-pocket costs.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Benefits of Using Insurance with CureBay
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

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-16 transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'providers'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('providers')}
                >
                  Accepted Insurance Providers
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'process'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('process')}
                >
                  Insurance Process
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'faq'
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('faq')}
                >
                  FAQ
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'providers' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                    Accepted Insurance Providers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {insuranceProviders.map((provider) => (
                      <div 
                        key={provider.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center mb-4">
                          <img 
                            src={provider.logo} 
                            alt={provider.name} 
                            className="h-12 mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">
                              {provider.name}
                            </h3>
                            <div className="flex items-center mt-1">
                              {provider.accepted ? (
                                <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accepted
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-sm text-red-600 dark:text-red-400">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  Not Accepted
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                          {provider.coverage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                    How Our Insurance Process Works
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="space-y-8">
                        <div className="flex">
                          <div className="mr-6">
                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                              <span className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">1</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                              Provide Insurance Information
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 transition-colors">
                              Enter your insurance details during checkout or provide them to our pharmacy team.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-6">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">2</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                              Verification & Eligibility Check
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 transition-colors">
                              Our team verifies your insurance coverage and checks medication eligibility.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <span className="text-green-600 dark:text-green-400 font-bold text-lg">3</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                              Prior Authorization (if needed)
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 transition-colors">
                              We handle prior authorization requests for medications that require approval.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-6">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">4</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                              Claim Submission & Fulfillment
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 transition-colors">
                              We submit claims to your insurance provider and fulfill your prescription.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 transition-colors">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                        Insurance Information Required
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200 transition-colors">
                            Insurance card front and back
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200 transition-colors">
                            Policyholder name and date of birth
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <CreditCard className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200 transition-colors">
                            Group number and member ID
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200 transition-colors">
                            Prescription details and quantity
                          </span>
                        </li>
                      </ul>
                      
                      <div className="mt-8">
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-medium transition-colors">
                          Verify Your Insurance
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medicare Information */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl w-48 h-48 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">MEDICARE</span>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                  Medicare Part D Coverage
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  We accept Medicare Part D insurance for prescription medications. 
                  Our pharmacists are trained to help you navigate Medicare coverage 
                  and find the most cost-effective options for your medications.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      We work with all major Medicare Part D plans
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Assistance with formulary questions and prior authorizations
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200 transition-colors">
                      Help with Medicare Extra Help (Low Income Subsidy) applications
                    </span>
                  </li>
                </ul>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  Learn About Medicare Coverage
                </Button>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-cyan-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center transition-colors">
            <h2 className="text-3xl font-bold text-white mb-4 transition-colors">
              Need Help with Insurance?
            </h2>
            <p className="text-cyan-100 dark:text-gray-200 text-lg mb-6 transition-colors">
              Our insurance specialists are available to help you maximize your coverage
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-colors">
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2 transition-colors">
                  Call Us
                </h3>
                <p className="text-cyan-100 dark:text-gray-200 transition-colors">
                  +1 (555) 123-4567<br />
                  Monday-Friday, 8AM-8PM
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-colors">
                <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2 transition-colors">
                  Email Us
                </h3>
                <p className="text-cyan-100 dark:text-gray-200 transition-colors">
                  insurance@curebay.com<br />
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthInsurancePage;