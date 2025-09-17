import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { products, updateStock } = useProducts();

  useEffect(() => {
    const savedCart = localStorage.getItem('metamart-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('metamart-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    const productInStock = products.find(p => p.id === product.id);
    const existingCartItem = items.find(item => item.id === product.id);
    const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;

    if (productInStock && (productInStock.stock >= currentCartQuantity + quantity)) {
      setItems(prev => {
        if (existingCartItem) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
      return true; // Added successfully
    }
    return false; // Not enough stock
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const productInStock = products.find(p => p.id === productId);
    if (!productInStock || newQuantity > productInStock.stock) {
        return false; // Not enough stock
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return true;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    return true;
  };

  const clearCartAndUpdateStock = () => {
    items.forEach(item => {
        updateStock(item.id, item.quantity);
    });
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart: clearCartAndUpdateStock, // Changed to reflect new functionality
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};