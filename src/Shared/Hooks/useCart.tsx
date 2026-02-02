"use client";
import { useContext } from 'react'
import { CartContext } from '../Providers/CartPovider';

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    const { cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart, handleRemoveItem, isLoading } = context;
    return { cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart, handleRemoveItem, isLoading };
}

export default useCart;