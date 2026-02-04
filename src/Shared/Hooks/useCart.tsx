"use client";
import { useContext } from 'react'
import { CartContext } from '../Providers/CartPovider';

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    const { cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart, handleRemoveItem, clearCart, isLoading } = context;
    return { cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart, handleRemoveItem, clearCart, isLoading };
}

export default useCart;