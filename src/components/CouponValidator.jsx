import React, { useState } from 'react';
import { Ticket, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const CouponValidator = () => {
  const [couponCode, setCouponCode] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      alert('Please enter a valid order amount');
      return;
    }

    setLoading(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          orderAmount: parseFloat(orderAmount)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setValidationResult({
          valid: true,
          coupon: data.coupon,
          discountAmount: data.discountAmount
        });
      } else {
        setValidationResult({
          valid: false,
          error: data.error
        });
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        error: 'Failed to validate coupon. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Coupon Validator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coupon-code">Coupon Code</Label>
          <Input
            id="coupon-code"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-amount">Order Amount ($)</Label>
          <Input
            id="order-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
          />
        </div>

        <Button 
          onClick={validateCoupon} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Validate Coupon'}
        </Button>

        {validationResult && (
          <div className={`p-4 rounded-lg ${validationResult.valid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            {validationResult.valid ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Valid Coupon!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Code: {validationResult.coupon.code}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Discount: ${validationResult.discountAmount.toFixed(2)}
                  </p>
                  {validationResult.coupon.maximumDiscountAmount && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Max discount: ${validationResult.coupon.maximumDiscountAmount}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Invalid Coupon
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {validationResult.error}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponValidator;