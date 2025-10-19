import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Remove the simulated delay - process immediately
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    
    // Reset form and show success state immediately
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset success state after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <>
      <SEOHelmet 
        title="Contact Us - CureBay Online Pharmacy"
        description="Get in touch with CureBay. We're here to help with any questions about our medicines, services, or delivery."
        keywords="contact CureBay, pharmacy contact, medicine delivery contact, healthcare support"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              We're here to help with any questions about our medicines, services, or delivery. 
              Reach out to us and we'll respond as soon as we can.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
                Get in Touch
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mr-5 transition-all duration-300 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50">
                    <MapPin className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                      Our Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                     Mirpur <br />
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-5 transition-all duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-900/50">
                    <Phone className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                      Phone Number
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      +880  1571151277
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-5 transition-all duration-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                    <Mail className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                      Email Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      support@curebay.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mr-5 transition-all duration-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50">
                    <Clock className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                      Working Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Monday - Friday: 8:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="mt-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl h-64 flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-500 dark:text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Interactive Map
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    Location of our headquarters
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Subject
                  </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="What is this regarding?"
                    />
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl flex items-center justify-center transition-all duration-300 font-medium text-lg ${
                    isSubmitting 
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                
                {isSubmitted && (
                  <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center animate-fadeIn">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        Message Sent Successfully!
                      </p>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        We'll get back to you as soon as possible.
                      </p>
                    </div>
                  </div>
                )}
              </form>
              
              {/* Support Info */}
              <div className="mt-8 bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Need Immediate Assistance?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  For urgent inquiries, call our 24/7 customer support line:
                </p>
                <a 
                  href="tel:+8801571151277" 
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +880 1571151277
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ContactPage;