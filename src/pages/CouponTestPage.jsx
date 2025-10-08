import React from 'react';
import CouponValidator from '../components/CouponValidator';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const CouponTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Coupon Test Page
          </h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            Back to Home
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Coupon Functionality
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Use this page to test the coupon validation system. Enter a coupon code and order amount to see if the coupon is valid.
          </p>
          
          <CouponValidator />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Use Coupons
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Apply Coupon at Checkout</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your coupon code in the designated field during checkout to apply the discount.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Check Validity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Coupons must be within their valid date range and meet any minimum order requirements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Enjoy Savings</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Valid coupons will automatically apply the discount to your order total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponTestPage;