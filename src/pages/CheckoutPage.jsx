import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { CreditCard, Lock, ShoppingBag, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import SEOHelmet from "../components/SEOHelmet";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema for shipping information
const shippingSchema = yup.object({
  street: yup
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .required('Street address is required'),
  city: yup
    .string()
    .min(2, 'City must be at least 2 characters')
    .required('City is required'),
  state: yup
    .string()
    .min(2, 'State must be at least 2 characters')
    .required('State is required'),
  zipCode: yup
    .string()
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
    .required('ZIP code is required'),
  country: yup
    .string()
    .required('Country is required'),
});

// Initialize Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const CheckoutForm = ({ orderData, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
  });

  // Watch all form values
  const formData = watch();

  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Dynamic CardElement styling based on theme
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: isDarkMode ? '#ffffff' : '#424770',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: isDarkMode ? '#9ca3af' : '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
  };

  const onSubmit = async (shippingData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // First create the order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile?.id || user?.uid,
          items: orderData.items,
          shippingAddress: shippingData
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // Create payment intent
      const paymentIntentResponse = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.totalAmount
        })
      });

      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await paymentIntentResponse.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: profile?.name || user?.displayName || user?.email,
            email: user?.email,
          },
        }
      });

      if (error) {
        console.error('Payment failed:', error);
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId: order._id
          })
        });

        toast.success('Payment successful!');
        onPaymentSuccess(order, paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="123 Main Street"
              className={errors.street ? 'border-red-500' : ''}
              {...register('street')}
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                className={errors.city ? 'border-red-500' : ''}
                {...register('city')}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="NY"
                className={errors.state ? 'border-red-500' : ''}
                {...register('state')}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                className={errors.zipCode ? 'border-red-500' : ''}
                {...register('zipCode')}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                className={errors.country ? 'border-red-500' : ''}
                {...register('country')}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Card Details</Label>
            <div className="mt-2 p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <CardElement
                options={cardElementOptions}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Lock className="w-4 h-4" />
            Your payment information is secure and encrypted
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing || !isValid}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `Pay $${orderData.total?.toFixed(2) || '0.00'}`
        )}
      </Button>
    </form>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get cart data from location state or localStorage
    const cartData = location.state?.cartData || JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (!cartData || cartData.length === 0) {
      toast.error('No items to checkout');
      navigate('/cart');
      return;
    }

    // Calculate totals
    const subtotal = cartData.reduce((sum, item) => {
      const price = item.discountPercentage > 0 
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
      return sum + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    setOrderData({
      items: cartData.map(item => ({
        medicineId: item._id,
        quantity: item.quantity
      })),
      cartItems: cartData,
      subtotal,
      tax,
      shipping,
      total
    });
  }, [location.state, navigate]);

  const handlePaymentSuccess = (order, paymentIntent) => {
    // Clear cart
    localStorage.removeItem('cartItems');
    
    // Navigate to invoice page
    navigate('/invoice', {
      state: {
        order,
        paymentIntent
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading checkout...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title="Checkout - CureBay Online Pharmacy"
        description="Complete your purchase securely with CureBay. Fast checkout process with secure payment options for your medicines and healthcare products."
        keywords="checkout, buy medicines online, secure payment, online pharmacy checkout"
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Checkout Form */}
          <div>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                orderData={orderData} 
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {orderData.cartItems.map((item) => {
                    const discountedPrice = item.discountPercentage > 0 
                      ? item.price * (1 - item.discountPercentage / 100)
                      : item.price;
                    
                    return (
                      <div key={item._id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            {item.discountPercentage > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {item.discountPercentage}% off
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(discountedPrice * item.quantity).toFixed(2)}</p>
                          {item.discountPercentage > 0 && (
                            <p className="text-xs text-gray-500 line-through">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{orderData.shipping === 0 ? 'Free' : `$${orderData.shipping.toFixed(2)}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {orderData.subtotal < 50 && (
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                      Add ${(50 - orderData.subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;