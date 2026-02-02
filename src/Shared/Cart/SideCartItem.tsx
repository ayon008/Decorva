"use client"
import { Minus, Plus, Trash2Icon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CartItem } from '../Providers/CartPovider';
import useCart from '../Hooks/useCart';


const SideCartItems = ({ item }: { item: CartItem }) => {
    const { handleAddToCart, handleRemoveFromCart, handleRemoveItem } = useCart();
    const [updating, setUpdating] = useState(false);
    const isMountedRef = useRef(true);
    const isUpdatingRef = useRef(false);


    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            isUpdatingRef.current = false;
        };
    }, []);

    return (
        <div className='flex items-center gap-8 bg-[#F7F7F7] p-[10px] rounded-sm'>
            <div>
                <Image src={item?.image} width={100} height={100} alt={item?.name} className='aspect-[1] object-contain' />
            </div>
            <div className='flex flex-col gap-[10px] w-full'>
                <span className='flex items-center justify-between'>
                    <span className='text-sm leading-[130%] capitalize font-bold text-[#111]'>{item?.name}</span>
                    <span>{item?.price + ' '}د.إ </span>
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
                    {item?.quantity * item?.price + ' '}د.إ
                </span>
                <div className='flex items-center justify-between gap-4'>
                    <span className='flex-[1_0_0] flex items-center gap-2'>
                        <button
                            title='Decrement quantity'
                            type='button'
                            onClick={() => handleRemoveFromCart(item?.id)}
                            // disabled={quantity <= 1 || updating || !isInStock}
                            className='cursor-pointer hover:bg-gray-100 rounded p-1 disabled:opacity-30 disabled:cursor-not-allowed'
                        >
                            <Minus className='w-4 h-4' />
                        </button>
                        <span className='min-w-[20px] text-center'>{item?.quantity}</span>
                        <button
                            title='Increment quantity'
                            type='button'
                            onClick={() => handleAddToCart({ id: item?.id, quantity: 1, price: item?.price, image: item?.image, name: item?.name })}
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
                        onClick={() => handleRemoveItem(item?.id)}
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

export default SideCartItems