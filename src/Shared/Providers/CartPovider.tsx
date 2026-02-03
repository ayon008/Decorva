"use client";
import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useEffect, useState } from 'react'

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
    isLoading: boolean;
}>({
    cartOpen: false,
    setCartOpen: () => { },
    handleAddToCart: () => { },
    getCartItems: (): CartItem[] => [],
    cartItemsCount: () => 0,
    itemsCount: 0,
    handleRemoveFromCart: () => { },
    handleRemoveItem: () => { },
    isLoading: false,
});

const cartKey = process.env.NEXT_PUBLIC_STORAGE_KEY || 'cart';

function mergeCarts(dbItems: CartItem[], localItems: CartItem[]): CartItem[] {
    const byId = new Map<string, CartItem>();
    for (const item of dbItems) {
        byId.set(item.id, { ...item });
    }
    for (const item of localItems) {
        const existing = byId.get(item.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            byId.set(item.id, { ...item });
        }
    }
    return Array.from(byId.values());
}

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [cartOpen, setCartOpen] = useState(false);
    const [dbCartItems, setDbCartItems] = useState<CartItem[]>([]);
    const [, setLocalVersion] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = status === 'authenticated' && !!session?.user?.id;

    const getLocalItems = useCallback((): CartItem[] => {
        if (typeof window === "undefined") return [];
        const raw = localStorage.getItem(cartKey);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    }, []);

    const getCartItems = useCallback((): CartItem[] => {
        if (typeof window === "undefined") return [];
        if (isLoggedIn) return dbCartItems;
        return getLocalItems();
    }, [isLoggedIn, dbCartItems, getLocalItems]);

    const cartItemsCount = useCallback((): number => {
        return getCartItems().reduce((acc, item) => acc + item.quantity, 0);
    }, [getCartItems]);

    const itemsCount = cartItemsCount();

    useEffect(() => {
        if (!isLoggedIn) return;

        const sync = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/cart');
                const { items: dbItems } = await res.json();
                const localItems = getLocalItems();

                if (localItems.length > 0) {
                    const merged = mergeCarts(dbItems ?? [], localItems);
                    const patchRes = await fetch('/api/cart', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: merged }),
                    });
                    const { items } = await patchRes.json();
                    setDbCartItems(items ?? []);
                    localStorage.removeItem(cartKey);
                } else {
                    setDbCartItems(dbItems ?? []);
                }
            } catch (e) {
                console.error('Cart sync error:', e);
                setDbCartItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        sync();
    }, [isLoggedIn, getLocalItems]);

    const handleAddToCart = useCallback(async (product: CartItem, open?: true) => {
        if (typeof window === "undefined") return;
        setCartOpen(open ?? true);

        if (isLoggedIn) {
            setIsLoading(true);
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product),
                });
                const data = await res.json();
                setDbCartItems(data.items ?? []);
            } catch (e) {
                console.error('Add to cart error:', e);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const localItems = getLocalItems();
        const existing = localItems.find((i) => i.id === product.id);
        const next = existing
            ? localItems.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + product.quantity } : i)
            : [...localItems, product];
        localStorage.setItem(cartKey, JSON.stringify(next));
        setLocalVersion((v) => v + 1);
    }, [isLoggedIn, getLocalItems]);

    const handleRemoveFromCart = useCallback(async (id: string) => {
        if (typeof window === "undefined") return;

        if (isLoggedIn) {
            const item = dbCartItems.find((i) => i.id === id);
            if (!item) return;
            const newQty = item.quantity - 1;
            setIsLoading(true);
            try {
                const res = await fetch('/api/cart', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: id, quantity: newQty }),
                });
                const data = await res.json();
                setDbCartItems(data.items ?? []);
            } catch (e) {
                console.error('Remove from cart error:', e);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const localItems = getLocalItems();
        const next = localItems
            .map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
            .filter((i) => i.quantity > 0);
        localStorage.setItem(cartKey, JSON.stringify(next));
        setLocalVersion((v) => v + 1);
    }, [isLoggedIn, dbCartItems, getLocalItems]);

    const handleRemoveItem = useCallback(async (id: string) => {
        if (typeof window === "undefined") return;

        if (isLoggedIn) {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/cart?productId=${encodeURIComponent(id)}`, { method: 'DELETE' });
                const data = await res.json();
                setDbCartItems(data.items ?? []);
            } catch (e) {
                console.error('Remove item error:', e);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const localItems = getLocalItems().filter((i) => i.id !== id);
        localStorage.setItem(cartKey, JSON.stringify(localItems));
        setLocalVersion((v) => v + 1);
    }, [isLoggedIn, getLocalItems]);

    return (
        <CartContext.Provider value={{ cartOpen, setCartOpen, handleAddToCart, getCartItems, cartItemsCount, itemsCount, handleRemoveFromCart: handleRemoveFromCart, handleRemoveItem: handleRemoveItem, isLoading }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;
