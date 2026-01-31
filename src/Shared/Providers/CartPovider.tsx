"use client";
import React, { createContext, useEffect, useState } from 'react'

export type CartItem = { id: string; quantity: number; price: number; image: string; name: string };

export const CartContext = createContext<{
    cartOpen: boolean;
    setCartOpen: (cartOpen: boolean) => void;
    handleAddToCart: (product: CartItem) => void;
    getCartItems: () => CartItem[];
    cartItemsCount: () => number;
    itemsCount: number;
    handleRemoveFromCart: (id: string) => void;
    handleRemoveItem: (id: string) => void;
}>({
    cartOpen: false,
    setCartOpen: () => { },
    handleAddToCart: () => { },
    getCartItems: (): CartItem[] => [],
    cartItemsCount: () => 0,
    itemsCount: 0,
    handleRemoveFromCart: (id: string) => { },
    handleRemoveItem: (id: string) => { }
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {


    const [cartOpen, setCartOpen] = useState(false);
    const cartKey = process.env.NEXT_PUBLIC_STORAGE_KEY || '';


    const getCartItems = (): CartItem[] => {
        if (typeof window === "undefined") return [];
        const cartItems = localStorage.getItem(cartKey);
        if (cartItems) {
            return JSON.parse(cartItems) as CartItem[];
        }
        return [];
    }

    const [itemsCount, setItemsCount] = useState<number>(0);

    const cartItemsCount = (): number => {
        const items = getCartItems();
        return items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem(cartKey);
        const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
        setItemsCount(items.reduce((acc, item) => acc + item.quantity, 0));
    }, [cartOpen, cartKey]);

    const handleAddToCart = (product: CartItem) => {
        if (typeof window === "undefined") return;
        setCartOpen(true);
        const cartItems = localStorage.getItem(cartKey);
        if (cartItems) {
            const cartItemsArray = JSON.parse(cartItems) as CartItem[];
            const existingProduct = cartItemsArray.find((item) => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                cartItemsArray.push(product);
            }
            localStorage.setItem(cartKey, JSON.stringify(cartItemsArray));
        } else {
            localStorage.setItem(cartKey, JSON.stringify([product]));
        }
        setItemsCount(cartItemsCount());
    };

    const handleRemoveFromCart = (id: string) => {
        if (typeof window === "undefined") return;

        const cartItems = localStorage.getItem(cartKey);
        if (!cartItems) return;

        try {
            let cartItemsArray = JSON.parse(cartItems) as CartItem[];
            cartItemsArray = cartItemsArray
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);

            localStorage.setItem(cartKey, JSON.stringify(cartItemsArray));
            setItemsCount(cartItemsCount());
        } catch (error) {
            console.error("Failed to remove item from cart", error);
        }
    };


    const handleRemoveItem = (id: string) => {
        if (typeof window === "undefined") return;
        const cartItems = localStorage.getItem(cartKey);
        if (!cartItems) return;
        try {
            let cartItemsArray = JSON.parse(cartItems) as CartItem[];
            cartItemsArray = cartItemsArray.filter((item) => item.id !== id);
            localStorage.setItem(cartKey, JSON.stringify(cartItemsArray));
            setItemsCount(cartItemsCount());
        } catch (error) {
            console.error("Failed to remove item from cart", error);
        }
    }


    return (
        <CartContext.Provider value={{ cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart: handleRemoveFromCart, handleRemoveItem: handleRemoveItem }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;