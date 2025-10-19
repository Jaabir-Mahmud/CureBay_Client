import React from 'react';
import SEOHelmet from '../../components/SEOHelmet';

const TermsOfServicePage = () => {
  return (
    <>
      <SEOHelmet 
        title="Terms of Service - CureBay Online Pharmacy"
        description="Read the terms and conditions for using CureBay's website and services."
        keywords="terms of service, terms and conditions, CureBay terms, pharmacy terms"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
              Last Updated: October 18, 2025
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
            <div className="prose prose-cyan dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                These Terms of Service ("Terms") govern your access to and use of the CureBay website and services. 
                By accessing or using our website and services, you agree to be bound by these Terms and our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                By accessing or using the CureBay website and services, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                2. Description of Services
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                CureBay provides an online platform for purchasing prescription and over-the-counter medications, 
                health products, and related services. Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mb-6 space-y-2 transition-colors">
                <li>Online pharmacy services</li>
                <li>Prescription management</li>
                <li>Medication delivery</li>
                <li>Health consultations</li>
                <li>Health information and resources</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                3. User Accounts
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                To access certain features of our services, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mb-6 space-y-2 transition-colors">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                4. Medical Disclaimer
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                CureBay provides information and services for educational and informational purposes only. 
                The information provided is not intended as medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified health provider with any questions 
                you may have regarding a medical condition.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                5. Prescription Requirements
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                For prescription medications, you must provide a valid prescription from a licensed healthcare provider. 
                We reserve the right to verify prescriptions with the prescribing physician and to refuse to fill any prescription 
                at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                6. Ordering and Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                By placing an order, you agree to pay all applicable fees, including the product price, taxes, 
                and shipping charges. You represent and warrant that you have the legal right to use any payment 
                method you provide to us.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                7. Shipping and Delivery
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We will make reasonable efforts to deliver your order within the estimated delivery timeframe. 
                However, delivery times are estimates only and are not guaranteed. We are not responsible for 
                delays caused by factors beyond our control.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                8. Returns and Refunds
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Due to the nature of pharmaceutical products, we have specific policies regarding returns and refunds:
              </p>
              <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mb-6 space-y-2 transition-colors">
                <li>Prescription medications are generally non-returnable and non-refundable</li>
                <li>Over-the-counter products may be eligible for return within 30 days of purchase</li>
                <li>All returns must be in original, unopened packaging</li>
                <li>Special orders and custom products are non-returnable</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                9. Intellectual Property
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                All content on the CureBay website, including text, graphics, logos, images, and software, 
                is the property of CureBay or its licensors and is protected by copyright and other intellectual 
                property laws. You may not use any content without our prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                10. Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                To the maximum extent permitted by law, CureBay shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                11. Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                These Terms shall be governed by and construed in accordance with the laws of the State of New Mexico, 
                without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                12. Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                We will provide notice of any significant changes by updating the "Last Updated" date at the top of this page.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 transition-colors">
                13. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Email: terms@curebay.com<br />
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

export default TermsOfServicePage;