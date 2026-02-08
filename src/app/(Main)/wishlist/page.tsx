"use client";

import PageTitle from "@/Shared/PageTitle/PageTitle";
import useWishlist from "@/Shared/Hooks/useWishlist";
import useCart from "@/Shared/Hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2Icon } from "lucide-react";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { handleAddToCart } = useCart();

  return (
    <div>
      <div className="global-margin">
        <PageTitle title="Wishlist" subTitle="Home / Wishlist" />
      </div>
      <section className="global-padding layout global-margin">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" strokeWidth={1} />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-gray-500 mb-6">Add items you like to save them for later.</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-[#F7F7F7] p-4 rounded-sm border border-[#E1E1E1]"
              >
                <Link href={`/product/${item.slug}`} className="shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="aspect-square object-cover rounded-sm"
                  />
                </Link>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h4 className="text-sm font-bold text-[#111] capitalize line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                  </Link>
                  <p className="text-primary font-medium">{item.price}د.إ</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      type="button"
                      title="Add to Cart"
                      onClick={() =>
                        handleAddToCart({
                          id: item.id,
                          quantity: 1,
                          price: item.price,
                          image: item.image,
                          name: item.name,
                        })
                      }
                      className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-sm text-sm hover:bg-primary/90 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      title="Remove from Wishlist"
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 rounded-sm hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2Icon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WishlistPage;
