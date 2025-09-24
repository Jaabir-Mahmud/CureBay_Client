import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext'; // Added AuthContext import
import SEOHelmet from '../../components/SEOHelmet';
import { useLanguage } from '../../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../../lib/i18n'; // Added translation import

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTax,
    getShipping,
    getFinalTotal
  } = useCart();
  
  const { user } = useAuth(); // Get user from AuthContext
  const { language } = useLanguage(); // Use language context
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getFinalTotal();

  const handleCheckout = () => {
    // Check if user is logged in before proceeding to checkout
    if (!user) {
      // Redirect to login page
      navigate('/auth');
      return;
    }
    
    // Navigate to checkout with cart data
    navigate('/checkout', { state: { cartData: cartItems } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('cart.empty', language)}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Add some medicines to get started</p>
          <Link to="/shop">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              {t('cart.continueShopping', language)}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title="Shopping Cart - CureBay Online Pharmacy"
        description="Review your selected medicines and healthcare products in your shopping cart. Secure checkout with fast delivery options."
        keywords="shopping cart, medicines cart, online pharmacy checkout, healthcare products"
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('cart.yourCart', language)}</h1>
          <p className="text-gray-600 dark:text-gray-300">Review your selected medicines</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedVariant}`} className="flex items-center space-x-4 p-4 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">by {item.company}</p>
                      <p className="text-lg font-bold text-cyan-500">${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.selectedVariant, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.selectedVariant, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id, item.selectedVariant)}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg transition-colors">
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-lg py-3"
                  onClick={handleCheckout}
                >
                  {t('cart.checkout', language)}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Link to="/shop" className="block">
                  <Button variant="outline" className="w-full">
                    {t('cart.continueShopping', language)}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default CartPage;