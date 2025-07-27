import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, Cart as CartType, CartItem } from '@/services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartType | null;
  cartItemCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated) return;
    
    try {
      const updatedCart = await apiService.addToCart(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!isAuthenticated) return;
    
    try {
      const updatedCart = await apiService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated) return;
    
    try {
      const updatedCart = await apiService.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      const updatedCart = await apiService.clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const value: CartContextType = {
    cart,
    cartItemCount: cart?.item_count || 0,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 