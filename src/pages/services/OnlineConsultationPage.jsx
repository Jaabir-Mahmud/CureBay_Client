import React from 'react';
import { Video, Calendar, Clock, User, Stethoscope, MessageCircle, Shield } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';

const OnlineConsultationPage = () => {
  const benefits = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Convenient Access",
      description: "Connect with healthcare professionals from the comfort of your home, saving time and travel costs."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Book appointments at your convenience with extended hours, including evenings and weekends."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "All consultations are conducted through secure, HIPAA-compliant video platforms."
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Qualified Experts",
      description: "Our board-certified physicians and specialists provide high-quality medical care."
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Book Your Consultation",
      description: "Select a healthcare provider and choose a time that works for you."
    },
    {
      step: "2",
      title: "Prepare for Your Visit",
      description: "Complete your medical history and upload any relevant documents or images."
    },
    {
      step: "3",
      title: "Connect Virtually",
      description: "Join your appointment through our secure video platform at the scheduled time."
    },
    {
      step: "4",
      title: "Receive Follow-up Care",
      description: "Get prescriptions sent to your pharmacy and access your visit summary."
    }
  ];

  const specialties = [
    "General Medicine",
    "Dermatology",
    "Mental Health",
    "Women's Health",
    "Men's Health",
    "Pediatrics",
    "Allergy & Immunology",
    "Cardiology Consultation"
  ];

  return (
    <>
      <SEOHelmet 
        title="Online Medical Consultation - CureBay"
        description="Connect with licensed healthcare professionals through secure video consultations for non-emergency medical needs."
        keywords="online consultation, telemedicine, virtual doctor visit, online healthcare, medical consultation"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Video className="w-12 h-12 text-cyan-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Online Medical Consultation
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 transition-colors">
              Connect with licensed healthcare professionals through secure video consultations for non-emergency medical needs.
            </p>
            <Button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white text-lg rounded-lg font-medium transition-colors">
              Book a Consultation
            </Button>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Why Choose Online Consultation?
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

          {/* Specialties */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Medical Specialties Available
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {specialties.map((specialty, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                  <Stethoscope className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">{specialty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              Consultation Types
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-cyan-200 dark:border-gray-700 transition-colors">
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Video className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                  Video Consultation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  Face-to-face consultation with a healthcare provider through secure video call.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">30-minute session</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">Prescription if needed</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">Follow-up care instructions</span>
                  </li>
                </ul>
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">৳49</div>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors">
                  Book Video Consultation
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-gray-700 transition-colors">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                  Chat Consultation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  Text-based consultation with a healthcare provider for quick questions.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">15-minute session</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">Prescription if needed</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">Follow-up care instructions</span>
                  </li>
                </ul>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">৳29</div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors">
                  Book Chat Consultation
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-green-200 dark:border-gray-700 transition-colors">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                  In-Person Consultation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  Traditional in-person visit with a healthcare provider at our clinic.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">45-minute session</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">Comprehensive examination</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors">Prescription and lab orders</span>
                  </li>
                </ul>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">৳79</div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
                  Book In-Person Visit
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 transition-colors">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  Is online consultation as effective as in-person visits?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  For many conditions, online consultations are just as effective as in-person visits. 
                  Our healthcare providers can diagnose and treat a wide range of conditions virtually, 
                  and can prescribe medications when appropriate.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  What conditions can be treated online?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Online consultations are suitable for many non-emergency conditions including colds, 
                  flu, allergies, skin conditions, mental health concerns, and chronic disease management. 
                  Our providers will determine if your condition is appropriate for virtual care.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  Is my information secure during online consultations?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Yes, we use HIPAA-compliant, encrypted platforms for all online consultations. 
                  Your personal health information is protected and never shared without your consent.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  Can I get prescriptions through online consultations?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Yes, if your healthcare provider determines a prescription is necessary, 
                  they can send it directly to your preferred pharmacy. Controlled substances 
                  cannot be prescribed through online consultations per regulatory requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlineConsultationPage;