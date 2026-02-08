"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useCallback, useEffect, useState } from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
};

export const WishlistContext = createContext<{
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
  isLoading: boolean;
}>({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistCount: 0,
  isLoading: false,
});

const wishlistKey = "decorva-wishlist";

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [dbItems, setDbItems] = useState<WishlistItem[]>([]);
  const [localItems, setLocalItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = status === "authenticated" && !!session?.user?.id;

  const getLocalItems = useCallback((): WishlistItem[] => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(wishlistKey);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  }, []);

  const wishlistItems = isLoggedIn ? dbItems : localItems;

  const persist = useCallback((items: WishlistItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(wishlistKey, JSON.stringify(items));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocalItems(getLocalItems());
    setMounted(true);
  }, [getLocalItems]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const sync = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/wishlist");
        const { items: fetchedItems } = await res.json();
        const local = getLocalItems();

        if (local.length > 0) {
          for (const item of local) {
            const alreadyInDb = (fetchedItems ?? []).some((i: WishlistItem) => i.id === item.id);
            if (!alreadyInDb) {
              await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item.id }),
              });
            }
          }
          const finalRes = await fetch("/api/wishlist");
          const { items: finalItems } = await finalRes.json();
          setDbItems(finalItems ?? []);
          localStorage.removeItem(wishlistKey);
          setLocalItems([]);
        } else {
          setDbItems(fetchedItems ?? []);
        }
      } catch (e) {
        console.error("Wishlist sync error:", e);
        setDbItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    sync();
  }, [isLoggedIn, getLocalItems]);

  const addToWishlist = useCallback(
    async (item: WishlistItem) => {
      if (typeof window === "undefined") return;

      if (isLoggedIn) {
        setIsLoading(true);
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: item.id }),
          });
          const data = await res.json();
          setDbItems(data.items ?? []);
        } catch (e) {
          console.error("Add to wishlist error:", e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setLocalItems((prev) => {
        if (prev.some((i) => i.id === item.id)) return prev;
        const next = [...prev, item];
        persist(next);
        return next;
      });
    },
    [isLoggedIn, persist]
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      if (typeof window === "undefined") return;

      if (isLoggedIn) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/wishlist?productId=${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
          const data = await res.json();
          setDbItems(data.items ?? []);
        } catch (e) {
          console.error("Remove from wishlist error:", e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setLocalItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        persist(next);
        return next;
      });
    },
    [isLoggedIn, persist]
  );

  const isInWishlist = useCallback(
    (id: string) => wishlistItems.some((i) => i.id === id),
    [wishlistItems]
  );

  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
