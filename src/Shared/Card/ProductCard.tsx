"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Image from 'next/image'
import productImage from "../../../public/product7.webp"
import { Star } from 'lucide-react'
import { ShoppingBag } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import useCart from '../Hooks/useCart';
import useWishlist from '../Hooks/useWishlist';
import type { WishlistItem } from '../Providers/WishlistProvider';

const ProductCard = ({ product }: { product: { id: string, images: { url: string }[], name: string, price: number, regularPrice: number, salePrice: number, slug: string } }) => {
    const { handleAddToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const discount = product?.regularPrice && product?.salePrice && ((product?.regularPrice - product?.salePrice) / product?.regularPrice * 100).toFixed(0) as unknown as number;
    const price = product?.salePrice ?? product?.regularPrice ?? product?.price;
    const imageUrl = product?.images?.[0]?.url || "/product7.webp";
    const inWishlist = isInWishlist(product?.id);

    const wishlistItem: WishlistItem = {
        id: product.id,
        name: product.name,
        price: price ?? 0,
        image: imageUrl,
        slug: product.slug,
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(wishlistItem);
        }
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart({
            id: product.id,
            quantity: 1,
            price: price ?? 0,
            image: imageUrl,
            name: product.name,
        });
    };

    return (
        <Link href={`/product/${product?.slug}`} className='relative w-full max-w-[350px] cursor-pointer group'>
            <div className='relative overflow-hidden'>
                <Image src={product?.images[0]?.url || productImage} alt="product" width={272} height={272} className='object-cover aspect-1 w-full h-auto' />
                <div className='bg-red-500 w-fit h-fit text-white font-normal px-2 rounded-xs absolute top-2 right-2'>{discount && discount > 0 && `- ` + discount + `%`}</div>
                <div className='bg-white py-4 px-6 absolute bottom-0 left-0 group-hover:opacity-100 transition-all duration-300 opacity-0 group-hover:translate-y-0 translate-y-10 flex items-center gap-x-6'>
                    <span title='Add to Cart' className='w-fit h-fit' onClick={handleCartClick}><ShoppingBag aria-label='Add to Cart' className='w-5 h-5 hover:text-primary transition-colors duration-300 text-black' /></span>
                    <span title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'} className='w-fit h-fit' onClick={handleWishlistClick}><Heart aria-label='Add to Wishlist' className={`w-5 h-5 transition-colors duration-300 ${inWishlist ? 'fill-red-500 text-red-500' : 'hover:text-primary text-black'}`} /></span>
                    <span title='View Product' className='w-fit h-fit'><Eye aria-label='View Product' className='w-5 h-5 hover:text-primary transition-colors duration-300 text-black' /></span>
                </div>
            </div>
            <div>
                <div className='flex flex-col gap-2 mt-5'>
                    <div className='flex items-center justify-center gap-1'>
                        <Star className='text-yellow-500 w-4 h-4' />
                        <Star className='text-yellow-500 w-4 h-4' />
                        <Star className='text-yellow-500 w-4 h-4' />
                        <Star className='text-yellow-500 w-4 h-4' />
                        <Star className='text-yellow-500 w-4 h-4' />
                    </div>
                    <h4 className='text-center text-sm leading-[16px] hover:text-primary transition-all duration-300 text-black'>{product?.name}</h4>
                </div>
                <div className='flex items-center justify-center gap-2 mt-4'>
                    <span className='text-[15px] font-medium leading-[16px] text-primary'>{product?.salePrice || product?.regularPrice || product?.price}د.إ</span>
                    {
                        product?.regularPrice && (
                            <span className='text-xs font-normal leading-[100%] line-through text-black'>{product?.regularPrice}د.إ</span>
                        )
                    }

                </div>
            </div>
        </Link>
    )
}

export default ProductCard;