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

// Initialize Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const CheckoutForm = ({ orderData, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      toast.error('Please fill in all shipping information');
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
          shippingAddress: shippingInfo
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
              value={shippingInfo.street}
              onChange={(e) => handleShippingChange('street', e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingInfo.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                placeholder="New York"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={shippingInfo.state}
                onChange={(e) => handleShippingChange('state', e.target.value)}
                placeholder="NY"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={shippingInfo.zipCode}
                onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                placeholder="10001"
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={shippingInfo.country}
                onChange={(e) => handleShippingChange('country', e.target.value)}
                required
              />
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
            <div className="mt-2 p-3 border rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            Your payment information is secure and encrypted
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Pay $${orderData.total?.toFixed(2) || '0.00'}`}
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
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
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
  );
};

export default CheckoutPage;