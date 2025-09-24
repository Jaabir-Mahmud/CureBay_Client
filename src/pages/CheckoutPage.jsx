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
import { useCart } from "../contexts/CartContext";
import { CreditCard, Lock, ShoppingBag, MapPin, CheckCircle, AlertCircle, Shield, Truck, RotateCcw } from "lucide-react";
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

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rb1FdEL7N6POkBPeropOADJ6LQmrPKWtG27P8raHEoUVbH0OFniLBouJpzxoLnvcrNofU5Bo2uim6iAQnKxR1LI00dJEmSxVv');

const CheckoutForm = ({ orderData, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'error'
  
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
      toast.error('Payment system is not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

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
          shippingAddress: shippingData,
          totalAmount: orderData.total,
          currency: 'usd'
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
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
          amount: orderData.total,
          currency: 'usd',
          customerEmail: user?.email
        })
      });

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await paymentIntentResponse.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: profile?.name || user?.displayName || user?.email,
            email: user?.email,
            address: {
              line1: shippingData.street,
              city: shippingData.city,
              state: shippingData.state,
              postal_code: shippingData.zipCode,
              country: shippingData.country
            }
          },
        }
      });

      if (error) {
        console.error('Payment failed:', error);
        setPaymentStatus('error');
        toast.error(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const confirmResponse = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId: order._id
          })
        });

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json();
          throw new Error(errorData.error || 'Failed to confirm payment');
        }

        const paymentRecord = await confirmResponse.json();
        setPaymentStatus('success');
        toast.success('Payment successful!');
        onPaymentSuccess(order, paymentIntent, paymentRecord);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error(error.message || 'Payment failed. Please try again.');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                {...register('street')}
                placeholder="123 Main St"
                className={errors.street ? 'border-red-500' : ''}
              />
              {errors.street && (
                <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="New York"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="NY"
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                placeholder="10001"
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...register('country')}
                placeholder="United States"
                className={errors.country ? 'border-red-500' : ''}
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
            <Label>Card Details *</Label>
            <div className="mt-2 p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <CardElement
                options={cardElementOptions}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">Secure Payment</p>
                <p>All transactions are protected with 256-bit SSL encryption.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orderData.cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />

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
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg mt-4">
              <p className="text-sm text-cyan-700 dark:text-cyan-300">
                Add ${(50 - orderData.subtotal).toFixed(2)} more for free shipping!
              </p>
            </div>
          )}
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
            {paymentStatus === 'processing' ? 'Processing Payment...' : 'Please wait...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pay ${orderData.total?.toFixed(2) || '0.00'}
          </span>
        )}
      </Button>
      
      {paymentStatus === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              Payment successful! Your order is being processed.
            </span>
          </div>
        </div>
      )}
      
      {paymentStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-300 font-medium">
              Payment failed. Please check your card details and try again.
            </span>
          </div>
        </div>
      )}
    </form>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart(); // Get cart items from context
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get cart data from location state or from CartContext
    const cartData = location.state?.cartData || cartItems;
    
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
        medicineId: item.id, // Changed from _id to id to match the cart structure
        quantity: item.quantity
      })),
      cartItems: cartData,
      subtotal,
      tax,
      shipping,
      total
    });
  }, [location.state, cartItems, navigate]);

  const handlePaymentSuccess = (order, paymentIntent, paymentRecord) => {
    // Clear cart
    localStorage.removeItem('cartItems');
    
    // Navigate to invoice page
    navigate('/invoice', {
      state: {
        order,
        paymentIntent,
        paymentRecord
      }
    });
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title="Checkout - CureBay"
        description="Secure checkout for your medicine orders"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Secure Checkout</h1>
            <p className="text-gray-600 dark:text-gray-300">Complete your purchase with confidence</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Elements stripe={stripePromise}>
                <CheckoutForm orderData={orderData} onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Secure Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">SSL Encryption</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Your data is secure</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">PCI Compliant</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Industry standard security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">24/7 Protection</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Fraud monitoring</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">Free shipping on orders over $50</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <RotateCcw className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">30-day return policy</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Need help?</p>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/contact'}>
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Summary Preview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium">${orderData?.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tax</span>
                      <span className="font-medium">${orderData?.tax?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                      <span className="font-medium">{orderData?.shipping === 0 ? 'Free' : `$${orderData?.shipping?.toFixed(2) || '0.00'}`}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${orderData?.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
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