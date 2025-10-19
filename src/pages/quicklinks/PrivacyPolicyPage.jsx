import React from 'react';
import SEOHelmet from '../../components/SEOHelmet';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHelmet 
        title="Privacy Policy - CureBay Online Pharmacy"
        description="Learn how CureBay protects your personal information and privacy when using our website and services."
        keywords="privacy policy, data protection, personal information, CureBay privacy"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
              Last Updated: October 18, 2025
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
            <div className="prose prose-cyan dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                CureBay ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our 
                website and use our services. Please read this privacy policy carefully. If you do not agree 
                with the terms of this privacy policy, please do not access the site.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 transition-colors">
                Personal Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We may collect personally identifiable information, such as your name, email address, phone number, 
                postal address, and payment information when you register on the site, place an order, subscribe 
                to our newsletter, respond to a survey, or fill out a form.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 transition-colors">
                Medical Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                With your consent, we may collect medical information including prescriptions, health conditions, 
                allergies, and other health-related data necessary to provide our pharmacy services.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 transition-colors">
                Usage Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We may also collect information that your browser sends whenever you visit our site or use our services. 
                This usage data may include information such as your computer's Internet Protocol (IP) address, 
                browser type, browser version, the pages of our site that you visit, the time and date of your visit, 
                the time spent on those pages, and other diagnostic data.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We use the information we collect in various ways, including to:
              </p>
              <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mb-6 space-y-2 transition-colors">
                <li>Provide, operate, and maintain our website and services</li>
                <li>Improve, personalize, and expand our website and services</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, 
                    to provide you with updates and other information relating to the website, and for marketing and 
                    promotional purposes</li>
                <li>Process your transactions and manage your orders</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We may share information we have collected about you in certain situations:
              </p>
              <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mb-6 space-y-2 transition-colors">
                <li><strong>With Service Providers:</strong> We may share your information with third-party service 
                    providers to monitor and analyze the use of our website, to contact you, and to process payments.</li>
                <li><strong>For Business Transfers:</strong> We may share or transfer your information in connection 
                    with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of 
                    all or a portion of our business to another company.</li>
                <li><strong>With Affiliates:</strong> We may share your information with our affiliates, in which case 
                    we will require those affiliates to honor this Privacy Policy.</li>
                <li><strong>With Business Partners:</strong> We may share your information with our business partners 
                    to offer you certain products, services or promotions.</li>
                <li><strong>With Law Enforcement:</strong> Under certain circumstances, we may be required to disclose 
                    your information if required to do so by law or in response to valid requests by public authorities.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                4. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We use administrative, technical, and physical security measures to help protect your personal information. 
                While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
                that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission 
                can be guaranteed against any interception or other type of misuse.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                5. Your Data Protection Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mb-6 space-y-2 transition-colors">
                <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                <li><strong>The right to rectification</strong> – You have the right to request that we correct any 
                    information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, 
                    under certain conditions.</li>
                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict 
                    the processing of your personal data, under certain conditions.</li>
                <li><strong>The right to object to processing</strong> – You have the right to object to our processing 
                    of your personal data, under certain conditions.</li>
                <li><strong>The right to data portability</strong> – You have the right to request that we transfer 
                    the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                6. Cookies
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We use cookies and similar tracking technologies to track the activity on our website and hold certain information. 
                Cookies are files with small amounts of data which may include an anonymous unique identifier. You can instruct 
                your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                7. Children's Privacy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Our website does not address anyone under the age of 13. We do not knowingly collect personally identifiable 
                information from anyone under the age of 13. If you are a parent or guardian and you are aware that your 
                child has provided us with personal data, please contact us.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                8. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                9. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Email: privacy@curebay.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 306 Chapmans Lane, San Ysidro, NM 87053
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;