'use client'
import React from 'react';
import SingleOrder from './SingleOrder';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Order, OrderItem } from '@prisma/client';
import Skeleton from '../Loader/Skeleton';

const Orders = () => {
    const { data: session } = useSession();
    const id = session?.user?.id;

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
            const response = await fetch(`/api/orders/${id}`);
            const data = await response.json();
            if (data.success) {
                return data.orders;
            }
            return null;
        },
        enabled: !!id
    });


    return (
        <div className='flex flex-col gap-4'>
            <h2 className={`product-title mb-0!`}>Orders</h2>
            <p>
                Here, you can review all your previous orders, track the status of active orders, edit or cancel them as needed.
            </p>
            <div className='flex flex-col gap-4'>
                {
                    isLoading ? <div className='flex flex-col gap-4'>
                        <Skeleton className='w-full h-[100px]' />
                        <Skeleton className='w-full h-[100px]' />
                        <Skeleton className='w-full h-[100px]' />
                    </div>
                        :
                        orders && orders.length > 0 && orders.map((order: Order & { items: OrderItem[] }) => (
                            <SingleOrder key={order.id} order={order} />
                        ))
                }
            </div>
        </div>
    );
};

export default Orders;