"use client"
import { Minus, Plus, Trash2Icon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CartItem } from '../Providers/CartPovider';
import useCart from '../Hooks/useCart';


const SideCartItems = ({ item }: { item: CartItem }) => {
    const { handleAddToCart, handleRemoveFromCart, handleRemoveItem } = useCart();
    // const image = item.images?.[0]?.src || item.image;
    // const name = item.name || item.title;

    // Declare state first
    // const [quantity, setQuantity] = useState<number>(item?.quantity);
    const [updating, setUpdating] = useState(false);
    const isMountedRef = useRef(true);
    const isUpdatingRef = useRef(false);




    // Use cart currency (from totals) as primary, fallback to item currency
    // This ensures consistency - all items use the same currency as the cart total
    // const cartCurrencySymbol = item?.totals?.currency_symbol || item?.prices?.currency_symbol || '€';
    // const currency_symbol = cartCurrencySymbol;
    // const total_Currency_Symbol = cartCurrencySymbol;
    // const variations = item?.variation || [];
    // const itemKey = item?.key;

    // Check if product is in stock
    // const isInStock = item?.stock_status === 'instock' || item?.is_in_stock === true || item?.catalog_visibility !== 'hidden';

    // Get maximum quantity from stock or quantity limits
    // const maxQuantity = item?.quantity_limits?.maximum || item?.stock_quantity || item?.quantity_limit || Infinity;

    // Recalculate total based on current quantity to ensure it's always up to date
    // const basePriceWithTax = parseInt(item?.prices?.price || 0);
    // const total = basePriceWithTax * quantity; // Recalculate total based on current quantity

    // Sync quantity with props when item.quantity changes (only when not updating to avoid conflicts)
    // useEffect(() => {
    //     // Skip sync if we're currently updating
    //     if (isUpdatingRef.current || updating) {
    //         return;
    //     }

    //     const itemQuantity = parseInt(item.quantity);
    //     const currentQuantity = parseInt(quantity);

    //     // Only sync if values differ and itemQuantity is valid
    //     if (itemQuantity !== currentQuantity && !isNaN(itemQuantity) && itemQuantity > 0) {
    //         setQuantity(itemQuantity);
    //     }
    // }, [item.quantity, quantity, updating]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            isUpdatingRef.current = false;
        };
    }, []);

    // Check if maximum quantity reached
    // const isMaxReached = quantity >= maxQuantity;

    const handleIncrement = async () => {
        // if (updating || isMaxReached) return;

        // const oldQuantity = quantity;
        // const newQuantity = quantity + 1;

        // Set updating state
        // setUpdating(true);
        // isUpdatingRef.current = true;

        // Optimistic update
        // setQuantity(newQuantity);

        // try {
        //     // const result = await onUpdateQuantity(itemKey, newQuantity);
        //     if (!result || !result.success) {
        //         // Revert on error
        //         if (isMountedRef.current) {
        //             setQuantity(oldQuantity);
        //         }
        //         console.error('Failed to increment quantity:', result?.error);
        //     }
        // } catch (error) {
        //     console.error('Failed to increment quantity:', error);
        //     if (isMountedRef.current) {
        //         setQuantity(oldQuantity); // Revert on error
        //     }
        // } finally {
        //     // Always reset updating state immediately
        //     setUpdating(false);
        //     // Reset ref after a brief moment to allow sync
        //     setTimeout(() => {
        //         isUpdatingRef.current = false;
        //     }, 150);
        // }
    };

    // const handleDecrement = async () => {
    //     if (updating || quantity <= 1) return;

    //     const oldQuantity = quantity;
    //     const newQuantity = quantity - 1;

    //     // Set updating state
    //     setUpdating(true);
    //     isUpdatingRef.current = true;

    //     // Optimistic update
    //     setQuantity(newQuantity);

    //     try {
    //         const result = await onUpdateQuantity(itemKey, newQuantity);
    //         if (!result || !result.success) {
    //             // Revert on error
    //             if (isMountedRef.current) {
    //                 setQuantity(oldQuantity);
    //             }
    //             console.error('Failed to decrement quantity:', result?.error);
    //         }
    //     } catch (error) {
    //         console.error('Failed to decrement quantity:', error);
    //         if (isMountedRef.current) {
    //             setQuantity(oldQuantity); // Revert on error
    //         }
    //     } finally {
    //         // Always reset updating state immediately
    //         setUpdating(false);
    //         // Reset ref after a brief moment to allow sync
    //         setTimeout(() => {
    //             isUpdatingRef.current = false;
    //         }, 150);
    //     }
    // };

    // const handleRemoveItem = async () => {
    //     if (updating) return;
    //     setUpdating(true);
    //     try {
    //         await onRemove(itemKey);
    //     } catch (error) {
    //         console.error('Failed to remove item:', error);
    //     } finally {
    //         if (isMountedRef.current) {
    //             setUpdating(false);
    //         }
    //     }
    // };

    // Format price (WooCommerce returns price in cents)
    // const formatPrice = (value) => {
    //     return (parseInt(value) / 100).toFixed(2);
    // };


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