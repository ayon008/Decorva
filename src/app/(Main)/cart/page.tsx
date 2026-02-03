"use client"
import { CartItemSkeleton } from '@/Shared/Cart/SiteCart'
import useCart from '@/Shared/Hooks/useCart'
import PageTitle from '@/Shared/PageTitle/PageTitle'
import { CartItem } from '@/Shared/Providers/CartPovider'
import { Minus, Plus, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Cart = () => {

    const { handleRemoveFromCart, handleAddToCart, handleRemoveItem, getCartItems, isLoading } = useCart();
    const cartItems = getCartItems();

    const total = cartItems.reduce((acc: number, item: { price: number, quantity: number }) => acc + item.price * item.quantity, 0);


    const CartItems = ({ items }: { items: CartItem }) => {
        return (
            <div className='bg-gray-100 rounded-sm p-2 flex items-center gap-2'>
                <div className=''>
                    <Image src={items.image} alt={items.name} width={100} height={100} className='aspect-[1] object-contain' />
                </div>
                <div className='flex flex-col gap-[10px] w-full'>
                    <span className='flex items-center justify-between'>
                        <span className='text-sm leading-[130%] capitalize font-bold text-[#111]'>{items?.name}</span>
                        <span>{items?.price + ' '}د.إ </span>
                    </span>
                    <span className='text-[#959595] text-sm space-y-2'>
                        {/* {
                        variations?.map((variation, i) => {
                            return (
                                <dl key={i} className="font-normal text-[12px] leading-[130%] text-[#111]">
                                    <span className='flex items-center gap-[2px]'>
                                        <dt dangerouslySetInnerHTML={{ __html: variation?.attribute }} />
                                        <span className='text-xs text-[#959595]'>:</span>
                                        <dd dangerouslySetInnerHTML={{ __html: variation?.value }} />
                                    </span>
                                </dl>
                            )
                        })
                    } */}
                    </span>
                    <span className='text-base leading-[130%] capitalize font-bold text-[#111]'>
                        {items?.quantity * items?.price + ' '}د.إ
                    </span>
                    <div className='flex items-center justify-between gap-4'>
                        <span className='flex-[1_0_0] flex items-center gap-2'>
                            <button
                                title='Decrement quantity'
                                type='button'
                                onClick={() => handleRemoveFromCart(items?.id)}
                                // disabled={quantity <= 1 || updating || !isInStock}
                                className='cursor-pointer hover:bg-gray-100 rounded p-1 disabled:opacity-30 disabled:cursor-not-allowed'
                            >
                                <Minus className='w-4 h-4' />
                            </button>
                            <span className='min-w-[20px] text-center'>{items?.quantity}</span>
                            <button
                                title='Increment quantity'
                                type='button'
                                onClick={() => handleAddToCart({ id: items?.id, quantity: 1, price: items?.price, image: items?.image, name: items?.name }, false)}
                                // disabled={updating || !isInStock || isMaxReached}
                                className='cursor-pointer hover:bg-gray-100 rounded p-1 disabled:opacity-30 disabled:cursor-not-allowed'
                            >
                                <Plus className='w-4 h-4' />
                            </button>
                            {/* {!isInStock && (
                            <span className='text-red-500 text-xs font-semibold'></span>
                        )} */}
                            {/* {isInStock && isMaxReached && (
                            <span className='text-orange-500 text-xs font-semibold'></span>
                        )} */}

                        </span>
                        <button
                            title='Remove item'
                            onClick={() => handleRemoveItem(items?.id)}
                            type='button'
                            // disabled={updating}
                            className='cursor-pointer hover:bg-red-100 rounded p-1 disabled:opacity-30 disabled:cursor-not-allowed'
                        >
                            <Trash2Icon className='w-5 h-5' />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='global-margin'>
                <PageTitle title="Cart" subTitle="Home / Cart" />
            </div>
            <section className='global-padding layout flex items-start gap-6 global-margin'>
                <div className='flex-1 flex flex-col gap-4'>
                    <div className='py-3 px-4 text-white uppercase text-base font-medium bg-[#222222]'>
                        Coupon
                    </div>
                    <div className='px-3 flex flex-col gap-4'>
                        {
                            isLoading ? Array.from({ length: 2 }).map((_, index) => <CartItemSkeleton key={index} />) : (
                                cartItems && cartItems.length > 0 ? cartItems.map((item: CartItem) => (
                                    <CartItems key={item.id} items={item} />
                                )) : <div className='text-center text-sm text-gray-500'>No items in cart</div>
                            )
                        }
                    </div>
                    <div className='border border-[#E1E1E1] p-4 flex flex-col gap-4'>
                        <p>Enter your coupon code if you have one</p>
                        <div className='flex items-center gap-2 max-w-[400px] w-full'>
                            <input type="text" placeholder='Enter coupon code' className='border border-[#E1E1E1] rounded-sm px-4 py-2' />
                            <button type="button" className='bg-[#222222] text-white px-4 py-2 rounded-sm cursor-pointer active:scale-[0.98] transition-all duration-300'>Apply Coupon</button>
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='py-3 px-4 text-white uppercase text-base font-medium bg-[#222222]'>
                        Cart Total
                    </div>
                    <div className='border border-[#E1E1E1] p-4 flex flex-col gap-4'>
                        <div className='flex flex-col gap-4 border-b border-b-[#E1E1E1] pb-4'>
                            <div className='flex items-center justify-between'>
                                <p className='text-sm font-medium'>Subtotal</p>
                                <p className='text-sm font-medium'>{total.toFixed(2)}د.إ</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='text-sm font-medium'>Shipping</p>
                                <p className='text-sm font-medium'>10.00د.إ</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm font-medium'>Total</p>
                            <p className='text-sm font-medium'>{total.toFixed(2)}د.إ</p>
                        </div>
                        <button type="button" className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer active:scale-[0.98] transition-all duration-300 w-fit ml-auto'>
                            <Link href="/checkout">
                                Proceed to Checkout
                            </Link>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Cart;