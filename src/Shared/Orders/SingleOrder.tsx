/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import productImage from "../../../public/product7.webp";
import { Order, OrderItem, OrderStatus, UserRole } from '@prisma/client';
import moment from "moment";
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const OrderDetails = ({ order, dashboard = false, refetch }: { order: Order & { items: OrderItem[] }, dashboard?: boolean, refetch?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const orderRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const auth = useSession();
    const iconRef = useRef(null);

    const updateOrderStatus = async (status: OrderStatus) => {
        Swal.fire({
            title: 'Please wait',
            text: 'Updating order status...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
        });
        const isAdmin = auth.data?.user?.roles.includes(UserRole.ADMIN);
        if (!isAdmin) return;
        const response = await fetch(`/api/orders/${order?.id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (data.success) {
            refetch?.();
            Swal.fire({
                title: 'Success',
                text: 'Order status updated successfully',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message || 'Failed to update order status',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
            });
        }
    }

    useGSAP(() => {
        if (!orderRef.current) return;

        const fullHeight = contentRef.current?.scrollHeight || 0;

        gsap.to(iconRef.current, {
            rotate: isOpen ? 180 : 0,
            duration: 0.4,
            ease: "power1.inOut"
        });

        gsap.to(contentRef.current, {
            height: isOpen ? fullHeight : 0,
            duration: 0.4,
            ease: "power2.out"
        });
    }, [isOpen]);


    const [visibleCount, setVisibleCount] = useState<number>(3);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 767) {
                setVisibleCount(1);
            } else if (window.innerWidth < 1280) {
                setVisibleCount(2);
            } else {
                setVisibleCount(3);
            }
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);

        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    const remaining = order?.items?.length - visibleCount;
    return (
        <div ref={orderRef} className='bg-[#F7F7F7] p-5'>
            <div className='grid md:grid-cols-5 grid-cols-2 gap-2 items-center cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                <div className='md:col-span-2 col-span-1'>
                    <div className={`flex items-center flex-wrap gap-2 ${isOpen ? "hidden" : "block"}`}>
                        {order?.items?.slice(0, visibleCount).map((item: OrderItem) => (
                            <Image
                                key={item.id}
                                src={item.imageUrl || productImage}
                                width={80}
                                height={80}
                                alt={item.productName}
                                className="w-[80px] h-[80px] aspect-[1] rounded-sm object-cover"
                            />))}

                        {remaining > 0 && (
                            <span className="block ml-2 text-[clamp(.875rem,-.625rem+1.875vw,1.25rem)] leading-[100%] font-semibold">
                                + {remaining}
                            </span>
                        )}
                    </div>

                    <div className='space-y-2'>
                        {
                            isOpen && <>
                                <p className='text-base leading-[100%] font-semibold'>{order?.orderNumber}</p>
                                <p className='text-sm text-[#111111bf] leading-[100%] font-medium'>
                                    {
                                        moment(order?.createdAt).format("DD MMM YYYY, hh:mm A")
                                    }
                                </p>
                            </>
                        }
                    </div>
                </div>
                <div className='space-y-2 md:text-left text-right'>
                    {
                        !isOpen && <>
                            <p className='text-base leading-[100%] font-semibold'>{order?.orderNumber}</p>
                            <p className='text-sm text-[#111111bf] leading-[100%] font-medium'>
                                {
                                    moment(order?.createdAt).format("DD MMM YYYY, hh:mm A")
                                }
                            </p>
                        </>
                    }
                </div>
                <div className='space-y-2'>
                    <p className={`text-base leading-[100%] font-semibold ${order?.status?.toLowerCase() === "cancelled" ? "text-[#8B0000]" : order?.status?.toLowerCase() === "processing" ? "text-[#D9C10F]" : order?.status?.toLowerCase() === "completed" ? "text-[#2A7029]" : "text-[#111]"} uppercase`}>{order?.status}</p>
                    <p className='text-sm text-[#111111bf] leading-[100%] font-medium'>{
                        moment(order?.updatedAt).format("DD MMM YYYY, hh:mm A")
                    }</p>
                </div>
                <div>
                    <div className='w-fit ml-auto flex items-center gap-2'>
                        <p className={`${isOpen ? "hidden" : "block"} text-base leading-[100%] font-semibold`}>{order?.total} AED</p>
                        <ChevronDown ref={iconRef} className='transition-transform duration-100 ease-in-out' />
                    </div>
                </div>
            </div>
            <div className='overflow-hidden h-0' ref={contentRef}>
                <div className='py-[26px] flex max-[1380px]:flex-col flex-row gap-10'>
                    {/* Details */}
                    <div className='max-w-[290px] max-[1380px]:max-w-full'>
                        <div className='flex flex-col gap-[30px]'>
                            <div className='flex flex-col gap-3'>
                                <span className='text-lg uppercase text-[#111] font-semibold leading-[100%]'>Details</span>
                                <div className='flex flex-col gap-[10px]'>
                                    <div className='flex flex-col gap-[2px]'>
                                        <span className='text-sm text-[#111]/75 uppercase leading-[100%]'>
                                            Receiver Name
                                        </span>
                                        <span className='text-lg leading-[130%] capitalize'>{`${order?.billingFirstName} ${order?.billingLastName}`}</span>
                                    </div>
                                    <div className='flex flex-col gap-[2px]'>
                                        <span className='text-sm text-[#111]/75 uppercase leading-[100%]'>
                                            Phone</span>
                                        <span className='text-lg leading-[130%]'>{`${order?.billingPhone}`}</span>
                                    </div>
                                    <div className='flex flex-col gap-[2px]'>
                                        <span className='text-sm text-[#111]/75 uppercase leading-[100%]'>Email</span>
                                        <span className='text-lg leading-[130%]'>{`${order?.billingEmail}`}</span>
                                    </div>
                                    <div className='flex flex-col gap-[2px]'>
                                        <span className='text-sm text-[#111]/75 uppercase leading-[100%]'>Address</span>
                                        <span className='text-lg leading-[130%]'>
                                            {order?.shippingAddress1
                                                ? `${order.shippingAddress1}${order.shippingAddress2 ? `, ${order.shippingAddress2}` : ''}, ${order.shippingCity}, ${order.shippingState}, ${order.shippingPostcode}, ${order.shippingCountry}`
                                                : `${order?.billingAddress1}${order?.billingAddress2 ? `, ${order.billingAddress2}` : ''}, ${order?.billingCity}, ${order?.billingState}, ${order?.billingPostcode}, ${order?.billingCountry}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col gap-3'>
                                    <span className='text-lg uppercase text-[#111] font-semibold leading-[100%]'>Payment</span>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-[#111]/75 uppercase leading-[100%]'>Payment</span>
                                        <span className='text-lg leading-[130%] capitalize'>{order?.paymentMethod || 'N/A'}</span>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-sm text-[#111]/75 uppercase leading-[100%]'>Payment Status</span>
                                        <span className='text-lg leading-[130%]'>{order.paymentStatus || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div className='flex flex-col gap-2'>
                            <span className='text-lg uppercase text-[#111] font-semibold leading-[100%]'>Details</span>
                            <ul className='space-y-2'>
                                {
                                    order?.items?.map((item: OrderItem) => (
                                        <li key={item.id}
                                            className="bg-white grid grid-cols-2 grid-rows-2 md:grid-cols-5 md:grid-rows-1 p-[10px] gap-[10px] items-center rounded-sm"
                                        >
                                            {/* Image */}
                                            <div className="row-span-1 col-span-1">
                                                <Image
                                                    src={item.imageUrl || productImage}
                                                    width={80}
                                                    height={80}
                                                    alt={item.productName}
                                                    className="w-[80px] h-[80px] aspect-[1] rounded-sm object-cover"
                                                />
                                            </div>

                                            {/* Name */}
                                            <div className="row-span-1 col-span-1 text-sm leading-[100%] text-[#111] md:text-left text-right capitalize">
                                                {item.productName}
                                            </div>

                                            {/* Price */}
                                            <div className="row-span-1 col-span-1 flex flex-col gap-[10px] md:text-right text-left">
                                                <p className="text-sm font-semibold leading-[100%] uppercase text-[#111]/40">Price</p>
                                                <span className="block text-lg leading-[130%] text-[#111] font-medium">
                                                    {item.price.toFixed(2)} AED
                                                </span>
                                            </div>

                                            {/* Quantity */}
                                            <div className="row-span-1 col-span-1 flex flex-col gap-[10px] text-right">
                                                <p className="text-sm font-semibold leading-[100%] uppercase text-[#111]/40">Quantity</p>
                                                <span className="block text-lg leading-[130%] text-[#111] font-medium">
                                                    {item.quantity}
                                                </span>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="row-span-1 col-span-2 md:col-span-1 flex flex-col gap-[10px] md:text-right text-left">
                                                <p className="text-sm font-semibold leading-[100%] uppercase text-[#111]/40">
                                                    Subtotal
                                                </p>
                                                <span className="block text-lg leading-[130%] text-[#111] font-medium">
                                                    {item?.subtotal} AED
                                                </span>
                                            </div>
                                        </li>
                                    ))
                                }

                                <li className='p-[10px] flex justify-between gap-[10px] bg-[#F7F7F7]'>
                                    <p className='uppercase text-[#111] text-sm font-semibold leading-[100%]'>
                                        Shipping Rate
                                    </p>
                                    <div className='flex flex-col text-right gap-[10px]'>
                                        <p className='text-sm font-semibold leading-[100%] uppercase text-[#111]/40'>Price</p>
                                        <span className='block text-lg leading-[130%] text-[#111] font-medium'>
                                            {order?.shippingCost} AED
                                        </span>
                                    </div>
                                </li>
                                <li className='p-[10px] flex justify-between gap-[10px] bg-[#F7F7F7]'>
                                    <p className='uppercase text-[#111] text-sm font-semibold leading-[100%]'>
                                        Tax
                                    </p>
                                    <div className='flex flex-col text-right gap-[10px]'>
                                        <p className='text-sm font-semibold leading-[100%] uppercase text-[#111]/40'>Price</p>
                                        <span className='block text-lg leading-[130%] text-[#111] font-medium'>
                                            {order?.taxAmount} AED
                                        </span>
                                    </div>
                                </li>
                                <li className='p-[10px] flex justify-between gap-[10px] text-lg font-bold uppercase text-white bg-[#1F1F1F]'>
                                    <p >
                                        Total
                                    </p>
                                    <p>{order?.total} AED</p>
                                </li>
                                {
                                    dashboard && (
                                        <>
                                            <li className='p-[10px] flex justify-between gap-[10px] text-lg font-bold uppercase items-center'>
                                                <div>
                                                    <p className='text-sm font-semibold leading-[100%] uppercase text-[#111]/40'>Payment Status</p>
                                                    <span className='block text-lg leading-[130%] text-[#111] font-medium mt-2'>
                                                        {order?.paymentStatus || 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <select className='p-4 w-[400px] border border-black/30 rounded-sm' title='status' value={order?.status} onChange={(e) => updateOrderStatus(e.target.value as OrderStatus)}>
                                                        <option value={OrderStatus.PENDING}>Pending</option>
                                                        <option value={OrderStatus.PROCESSING}>Processing</option>
                                                        <option value={OrderStatus.ON_HOLD}>On Hold</option>
                                                        <option value={OrderStatus.COMPLETED}>Completed</option>
                                                        <option value={OrderStatus.CANCELLED}>Cancelled</option>
                                                        <option value={OrderStatus.REFUNDED}>Refunded</option>
                                                        <option value={OrderStatus.FAILED}>Failed</option>
                                                    </select>
                                                </div>
                                            </li>
                                        </>

                                    )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;