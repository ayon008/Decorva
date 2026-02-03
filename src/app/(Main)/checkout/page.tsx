/* eslint-disable @next/next/no-img-element */
"use client"
import PageTitle from '@/Shared/PageTitle/PageTitle'
import React, { useEffect, useMemo } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import useCart from '@/Shared/Hooks/useCart'

declare global {
    interface Window {
        paypal?: {
            Buttons: (config: {
                createOrder: (data: unknown, actions: { order: { create: (order: { purchase_units: Array<{ amount: { value: string; currency_code: string }; description: string }> }) => Promise<string> } }) => Promise<string>;
                onApprove: (data: { orderID: string }, actions: { order?: { capture: () => Promise<{ id: string; payer: unknown }> } }) => Promise<void>;
                onError: (err: Error) => void;
            }) => {
                render: (container: string) => void;
            };
        };
    }
}

type CheckoutFormValues = {
    // Billing Details
    billingFirstName: string;
    billingLastName: string;
    billingEmail: string;
    billingPhone: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingPostcode: string;
    billingCountry: string;
    // Shipping Details (optional)
    shipToDifferentAddress: boolean;
    shippingFirstName?: string;
    shippingLastName?: string;
    shippingEmail?: string;
    shippingPhone?: string;
    shippingAddress?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingPostcode?: string;
    shippingCountry?: string;
    // Payment Method
    paymentMethod: 'PAYPAL' | 'CASH_ON_DELIVERY' | 'CREDIT_CARD';
    // Order Notes
    orderNotes?: string;
}

const Checkout = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { getCartItems } = useCart();
    
    const cartItems = getCartItems();

    const { data: userData } = useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            if (!userId) return null;
            const response = await fetch(`/api/user/${userId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        },
        enabled: !!userId,
    });

    const { register, handleSubmit, watch, reset, getValues, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
        defaultValues: {
            shipToDifferentAddress: false,
            paymentMethod: 'PAYPAL',
        }
    });

    useEffect(() => {
        if (userData) {
            const billing = userData.billingAddress;
            const shipping = userData.shippingAddress;
            
            reset({
                shipToDifferentAddress: false,
                // Billing defaults
                billingFirstName: billing?.firstName || userData.firstName || '',
                billingLastName: billing?.lastName || userData.lastName || '',
                billingEmail: billing?.email || userData.email || '',
                billingPhone: billing?.phone || userData.phone || '',
                billingAddress: billing?.address1 || '',
                billingCity: billing?.city || '',
                billingState: billing?.state || '',
                billingPostcode: billing?.postcode || '',
                billingCountry: billing?.country || '',
                // Shipping defaults
                shippingFirstName: shipping?.firstName || userData.firstName || '',
                shippingLastName: shipping?.lastName || userData.lastName || '',
                shippingEmail: shipping?.email || userData.email || '',
                shippingPhone: shipping?.phone || userData.phone || '',
                shippingAddress: shipping?.address1 || '',
                shippingCity: shipping?.city || '',
                shippingState: shipping?.state || '',
                shippingPostcode: shipping?.postcode || '',
                shippingCountry: shipping?.country || '',
            });
        }
    }, [userData, reset]);

    const shipToDifferentAddress = watch('shipToDifferentAddress');
    const paymentMethod = watch('paymentMethod');

    const orderSummary = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = 10; // Fixed shipping cost, can be made dynamic
        const taxAmount = subtotal * 0.05; // 5% tax, can be made dynamic
        const total = subtotal + shippingCost + taxAmount;
        
        return {
            subtotal,
            shippingCost,
            taxAmount,
            total,
        };
    }, [cartItems]);

    const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
        if (paymentMethod === 'PAYPAL') {
            return; // PayPal handles submission separately
        }
        
        // Handle other payment methods
        console.log('Order data:', {
            ...data,
            items: cartItems,
            total: orderSummary.total,
        });
        
        // TODO: Create order via API
    }

    // PayPal Integration
    useEffect(() => {
        if (paymentMethod !== 'PAYPAL' || cartItems.length === 0) {
            const paypalContainer = document.getElementById('paypal-button-container');
            if (paypalContainer) {
                paypalContainer.innerHTML = '';
            }
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_CLIENT_ID'}&currency=USD`;
        script.async = true;
        
        const currentTotal = orderSummary.total;
        const currentCartItems = [...cartItems];
        
        script.onload = () => {
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: currentTotal.toFixed(2),
                                    currency_code: 'USD',
                                },
                                description: `Order from Decorva - ${currentCartItems.length} item(s)`,
                            }],
                        });
                    },
                    onApprove: async (data, actions) => {
                        try {
                            const order = await actions.order?.capture();
                            if (order) {
                                // Handle successful payment
                                const formData = getValues();
                                console.log('PayPal payment successful:', {
                                    orderId: order.id,
                                    payer: order.payer,
                                    formData,
                                    items: currentCartItems,
                                    total: currentTotal,
                                });
                                
                                // TODO: Create order via API with PayPal transaction ID
                                // await fetch('/api/orders', {
                                //     method: 'POST',
                                //     headers: { 'Content-Type': 'application/json' },
                                //     body: JSON.stringify({
                                //         ...formData,
                                //         paymentMethod: 'PAYPAL',
                                //         transactionId: order.id,
                                //         items: currentCartItems,
                                //         total: currentTotal,
                                //     }),
                                // });
                            }
                        } catch (error) {
                            console.error('PayPal error:', error);
                        }
                    },
                    onError: (err) => {
                        console.error('PayPal error:', err);
                    },
                }).render('#paypal-button-container');
            }
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup
            const paypalContainer = document.getElementById('paypal-button-container');
            if (paypalContainer) {
                paypalContainer.innerHTML = '';
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod, cartItems.length, orderSummary.total]);
    return (
        <div>
            <div className='global-margin'>
                <PageTitle title="Checkout" subTitle="Home / Checkout" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='global-padding layout flex items-start gap-6 global-margin'>
                <div className='flex-1'>
                    <div className='py-3 px-4 text-white uppercase text-base font-medium bg-[#222222]'>
                        Billing Details
                    </div>
                    <div className='mt-4 grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-first-name" className='text-sm font-medium'>First Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-first-name"
                                placeholder='Enter first name'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingFirstName ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingFirstName', { required: 'First name is required' })}
                            />
                            {errors.billingFirstName && <p className='text-xs text-red-500'>{errors.billingFirstName.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-last-name" className='text-sm font-medium'>Last Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-last-name"
                                placeholder='Enter last name'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingLastName ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingLastName', { required: 'Last name is required' })}
                            />
                            {errors.billingLastName && <p className='text-xs text-red-500'>{errors.billingLastName.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-email" className='text-sm font-medium'>Email <span className='text-red-500'>*</span></label>
                            <input
                                type="email"
                                id="billing-email"
                                placeholder='Enter email'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingEmail ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingEmail', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                            />
                            {errors.billingEmail && <p className='text-xs text-red-500'>{errors.billingEmail.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-phone" className='text-sm font-medium'>Phone <span className='text-red-500'>*</span></label>
                            <input
                                type="tel"
                                id="billing-phone"
                                placeholder='Enter phone'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingPhone ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingPhone', { required: 'Phone is required' })}
                            />
                            {errors.billingPhone && <p className='text-xs text-red-500'>{errors.billingPhone.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-address" className='text-sm font-medium'>Address <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-address"
                                placeholder='Enter address'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingAddress ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingAddress', { required: 'Address is required' })}
                            />
                            {errors.billingAddress && <p className='text-xs text-red-500'>{errors.billingAddress.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-city" className='text-sm font-medium'>City <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-city"
                                placeholder='Enter city'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingCity ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingCity', { required: 'City is required' })}
                            />
                            {errors.billingCity && <p className='text-xs text-red-500'>{errors.billingCity.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-state" className='text-sm font-medium'>State <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-state"
                                placeholder='Enter state'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingState ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingState', { required: 'State is required' })}
                            />
                            {errors.billingState && <p className='text-xs text-red-500'>{errors.billingState.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="billing-postcode" className='text-sm font-medium'>Postcode <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-postcode"
                                placeholder='Enter postcode'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingPostcode ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingPostcode', { required: 'Postcode is required' })}
                            />
                            {errors.billingPostcode && <p className='text-xs text-red-500'>{errors.billingPostcode.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2 col-span-2'>
                            <label htmlFor="billing-country" className='text-sm font-medium'>Country <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="billing-country"
                                placeholder='Enter country'
                                className={`w-full border rounded-sm px-4 py-2 ${errors.billingCountry ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                {...register('billingCountry', { required: 'Country is required' })}
                            />
                            {errors.billingCountry && <p className='text-xs text-red-500'>{errors.billingCountry.message}</p>}
                        </div>
                    </div>
                    <div className='flex items-center gap-2 mt-4'>
                        <input
                            type='checkbox'
                            id='ship-to-different-address'
                            className='w-4 h-4'
                            {...register('shipToDifferentAddress')}
                        />
                        <label htmlFor="ship-to-different-address" className='text-sm font-medium cursor-pointer bg-[#222222] text-white px-4 py-2 rounded-sm'>Ship to a different address?</label>
                    </div>
                    {shipToDifferentAddress && (
                        <div className='mt-4 grid grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-first-name" className='text-sm font-medium'>First Name <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-first-name"
                                    placeholder='Enter first name'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingFirstName ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingFirstName', {
                                        required: shipToDifferentAddress ? 'First name is required' : false,
                                    })}
                                />
                                {errors.shippingFirstName && <p className='text-xs text-red-500'>{errors.shippingFirstName.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-last-name" className='text-sm font-medium'>Last Name <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-last-name"
                                    placeholder='Enter last name'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingLastName ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingLastName', {
                                        required: shipToDifferentAddress ? 'Last name is required' : false,
                                    })}
                                />
                                {errors.shippingLastName && <p className='text-xs text-red-500'>{errors.shippingLastName.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-email" className='text-sm font-medium'>Email <span className='text-red-500'>*</span></label>
                                <input
                                    type="email"
                                    id="shipping-email"
                                    placeholder='Enter email'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingEmail ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingEmail', {
                                        required: shipToDifferentAddress ? 'Email is required' : false,
                                        pattern: shipToDifferentAddress ? {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Please enter a valid email address',
                                        } : undefined,
                                    })}
                                />
                                {errors.shippingEmail && <p className='text-xs text-red-500'>{errors.shippingEmail.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-phone" className='text-sm font-medium'>Phone <span className='text-red-500'>*</span></label>
                                <input
                                    type="tel"
                                    id="shipping-phone"
                                    placeholder='Enter phone'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingPhone ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingPhone', {
                                        required: shipToDifferentAddress ? 'Phone is required' : false,
                                    })}
                                />
                                {errors.shippingPhone && <p className='text-xs text-red-500'>{errors.shippingPhone.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-address" className='text-sm font-medium'>Address <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-address"
                                    placeholder='Enter address'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingAddress ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingAddress', {
                                        required: shipToDifferentAddress ? 'Address is required' : false,
                                    })}
                                />
                                {errors.shippingAddress && <p className='text-xs text-red-500'>{errors.shippingAddress.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-city" className='text-sm font-medium'>City <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-city"
                                    placeholder='Enter city'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingCity ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingCity', {
                                        required: shipToDifferentAddress ? 'City is required' : false,
                                    })}
                                />
                                {errors.shippingCity && <p className='text-xs text-red-500'>{errors.shippingCity.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-state" className='text-sm font-medium'>State <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-state"
                                    placeholder='Enter state'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingState ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingState', {
                                        required: shipToDifferentAddress ? 'State is required' : false,
                                    })}
                                />
                                {errors.shippingState && <p className='text-xs text-red-500'>{errors.shippingState.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="shipping-postcode" className='text-sm font-medium'>Postcode <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-postcode"
                                    placeholder='Enter postcode'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingPostcode ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingPostcode', {
                                        required: shipToDifferentAddress ? 'Postcode is required' : false,
                                    })}
                                />
                                {errors.shippingPostcode && <p className='text-xs text-red-500'>{errors.shippingPostcode.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2 col-span-2'>
                                <label htmlFor="shipping-country" className='text-sm font-medium'>Country <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="shipping-country"
                                    placeholder='Enter country'
                                    className={`w-full border rounded-sm px-4 py-2 ${errors.shippingCountry ? 'border-red-500' : 'border-[#E1E1E1]'}`}
                                    {...register('shippingCountry', {
                                        required: shipToDifferentAddress ? 'Country is required' : false,
                                    })}
                                />
                                {errors.shippingCountry && <p className='text-xs text-red-500'>{errors.shippingCountry.message}</p>}
                            </div>
                        </div>
                    )}
                    <div className='mt-4'>
                        <label htmlFor="order-notes" className='text-sm font-medium'>Order Notes</label>
                        <textarea
                            id="order-notes"
                            placeholder='Enter note'
                            className='w-full resize-none border border-[#E1E1E1] rounded-sm px-4 py-2 mt-2 h-[100px]'
                            {...register('orderNotes')}
                        />
                    </div>
                    <div className='mt-6'>
                        <h3 className='text-lg font-semibold mb-4'>Payment Method</h3>
                        <div className='flex flex-col gap-3'>
                            <label className='flex items-center gap-3 p-4 border border-[#E1E1E1] rounded-sm cursor-pointer hover:bg-gray-50'>
                                <input
                                    type="radio"
                                    value="PAYPAL"
                                    {...register('paymentMethod', { required: 'Payment method is required' })}
                                    className='w-4 h-4'
                                />
                                <div className='flex items-center gap-2'>
                                    <svg className='w-8 h-8' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.417 1.73 1.207 4.3-1.004 6.434-1.623 1.574-3.97 2.12-5.876 2.12h-2.876c-.748 0-1.127.593-1.24 1.002L9.76 20.037a.641.641 0 0 1-.633.74l-2.05.56z" fill="#0070BA"/>
                                        <path d="M9.46 7.6c.105-1.477 1.31-2.723 2.84-2.723h5.66c.748 0 1.127.593 1.24 1.002l1.582 11.238a.641.641 0 0 1-.633.74h-3.782c-.748 0-1.127-.593-1.24-1.002L9.46 7.6z" fill="#001C64"/>
                                        <path d="M19.61 5.153h-1.24c-.748 0-1.127.593-1.24 1.002l-.72 5.11c-.105.748.448 1.41 1.196 1.41h.84l.72-5.11c.105-.41.485-1.002 1.233-1.002h.03c.748 0 1.127-.593 1.24-1.002.105-.41-.485-1.002-1.233-1.002z" fill="#0070BA"/>
                                    </svg>
                                    <span className='text-sm font-medium'>PayPal</span>
                                </div>
                            </label>
                            <label className='flex items-center gap-3 p-4 border border-[#E1E1E1] rounded-sm cursor-pointer hover:bg-gray-50'>
                                <input
                                    type="radio"
                                    value="CASH_ON_DELIVERY"
                                    {...register('paymentMethod', { required: 'Payment method is required' })}
                                    className='w-4 h-4'
                                />
                                <span className='text-sm font-medium'>Cash on Delivery</span>
                            </label>
                            <label className='flex items-center gap-3 p-4 border border-[#E1E1E1] rounded-sm cursor-pointer hover:bg-gray-50'>
                                <input
                                    type="radio"
                                    value="CREDIT_CARD"
                                    {...register('paymentMethod', { required: 'Payment method is required' })}
                                    className='w-4 h-4'
                                />
                                <span className='text-sm font-medium'>Credit/Debit Card</span>
                            </label>
                        </div>
                        {errors.paymentMethod && <p className='text-xs text-red-500 mt-2'>{errors.paymentMethod.message}</p>}
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='py-3 px-4 text-white uppercase text-base font-medium bg-[#222222]'>
                        Your Order
                    </div>
                    <div className='mt-4'>
                        {cartItems.length === 0 ? (
                            <div className='text-center py-8 text-gray-500'>
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <table className='w-full mt-4 border-collapse'>
                                    <thead>
                                        <tr className='bg-[#E1E1E1]'>
                                            <th className='text-base font-medium text-center w-1/2 p-4'>Product</th>
                                            <th className='text-base font-medium text-center w-1/2 p-4'>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className='border-b border-[#E1E1E1]'>
                                                <td className='text-center p-4 border-r border-[#E1E1E1]'>
                                                    <div className='flex items-center gap-2 justify-center'>
                                                        {item.image && (
                                                            <img src={item.image} alt={item.name} className='w-10 h-10 object-cover rounded' />
                                                        )}
                                                        <span>{item.name} × {item.quantity}</span>
                                                    </div>
                                                </td>
                                                <td className='text-center p-4'>{(item.price * item.quantity).toFixed(2)}د.إ</td>
                                            </tr>
                                        ))}
                                        <tr className='border-b border-[#E1E1E1]'>
                                            <td className='text-center p-4 border-r border-[#E1E1E1] font-medium'>Subtotal</td>
                                            <td className='text-center p-4'>{orderSummary.subtotal.toFixed(2)}د.إ</td>
                                        </tr>
                                        <tr className='border-b border-[#E1E1E1]'>
                                            <td className='text-center p-4 border-r border-[#E1E1E1] font-medium'>Tax</td>
                                            <td className='text-center p-4'>{orderSummary.taxAmount.toFixed(2)}د.إ</td>
                                        </tr>
                                        <tr className='border-b border-[#E1E1E1]'>
                                            <td className='text-center p-4 border-r border-[#E1E1E1] font-medium'>Shipping</td>
                                            <td className='text-center p-4'>{orderSummary.shippingCost.toFixed(2)}د.إ</td>
                                        </tr>
                                        <tr className='border-b border-[#E1E1E1]'>
                                            <td className='text-center p-4 border-r border-[#E1E1E1] font-bold'>Total</td>
                                            <td className='text-center p-4 font-bold'>{orderSummary.total.toFixed(2)}د.إ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        )}
                        {paymentMethod === 'PAYPAL' ? (
                            <div id="paypal-button-container" className='mt-4'></div>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting || cartItems.length === 0}
                                className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer active:scale-[0.98] transition-all duration-300 w-full mt-4 block disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Checkout