import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('sneaker_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('sneaker_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prevCart => prevCart.map(item =>
      item.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
