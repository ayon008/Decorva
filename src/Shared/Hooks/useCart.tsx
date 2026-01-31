"use client";
import React, { useContext } from 'react'
import { CartContext } from '../Providers/CartPovider';

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    const { cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart, handleRemoveItem } = context;
    return { cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart, handleRemoveItem };
}

export default useCart;