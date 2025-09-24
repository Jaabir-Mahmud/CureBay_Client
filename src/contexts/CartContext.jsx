import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { product, quantity = 1, selectedVariant } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name,
          company: product.company,
          price: product.finalPrice || product.price, // Use finalPrice if available, otherwise use price
          originalPrice: product.originalPrice,
          discount: product.discountPercentage,
          image: product.image,
          category: product.category,
          genericName: product.genericName,
          massUnit: product.massUnit,
          selectedVariant: selectedVariant || product.massUnit,
          quantity: quantity,
          inStock: product.inStock,
          addedAt: new Date().toISOString()
        };

        return {
          ...state,
          items: [...state.items, newItem]
        };
      }
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, selectedVariant, quantity } = action.payload;
      
      if (quantity < 1) {
        // Remove item if quantity is less than 1
        return {
          ...state,
          items: state.items.filter(
            item => !(item.id === id && item.selectedVariant === selectedVariant)
          )
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id && item.selectedVariant === selectedVariant
            ? { ...item, quantity }
            : item
        )
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const { id, selectedVariant } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === id && item.selectedVariant === selectedVariant)
        )
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: []
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('curebay_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('curebay_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Cart actions
  const addToCart = (product, quantity = 1, selectedVariant) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { product, quantity, selectedVariant }
    });
    
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      icon: '🛒'
    });
  };

  const updateQuantity = (id, selectedVariant, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, selectedVariant, quantity }
    });
  };

  const removeFromCart = (id, selectedVariant) => {
    const item = state.items.find(
      item => item.id === id && item.selectedVariant === selectedVariant
    );
    
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: { id, selectedVariant }
    });
    
    if (item) {
      toast.success(`${item.name} removed from cart`, {
        duration: 2000,
        icon: '🗑️'
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success('Cart cleared', {
      duration: 2000,
      icon: '🧹'
    });
  };

  // Helper functions
  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSubtotal = () => {
    return getCartTotal();
  };

  const getTax = (taxRate = 0.08) => {
    return getSubtotal() * taxRate;
  };

  const getShipping = (freeShippingThreshold = 50, shippingCost = 5.99) => {
    return getSubtotal() >= freeShippingThreshold ? 0 : shippingCost;
  };

  const getFinalTotal = (taxRate = 0.08, freeShippingThreshold = 50, shippingCost = 5.99) => {
    return getSubtotal() + getTax(taxRate) + getShipping(freeShippingThreshold, shippingCost);
  };

  const isInCart = (productId, selectedVariant) => {
    return state.items.some(
      item => item.id === productId && item.selectedVariant === selectedVariant
    );
  };

  const getCartItem = (productId, selectedVariant) => {
    return state.items.find(
      item => item.id === productId && item.selectedVariant === selectedVariant
    );
  };

  const value = {
    // State
    cartItems: state.items,
    itemCount: getCartItemCount(),
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    
    // Calculations
    getCartTotal,
    getSubtotal,
    getTax,
    getShipping,
    getFinalTotal,
    
    // Utilities
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;