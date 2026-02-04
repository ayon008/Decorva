'use client'
import Skeleton from '@/Shared/Loader/Skeleton';
import SingleOrder from '@/Shared/Orders/SingleOrder';
import { Order, OrderItem } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
const AllOrdersPage = () => {

    const { data: orders = [], isLoading, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (data.success) {
                return data.data;
            }
            return null;
        }
    })

    return (
        <div>
            <header className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Manage Orders</h2>
            </header>
            <div className="flex flex-col gap-4">
                {
                    isLoading ? <div className='flex flex-col gap-4'>
                        <Skeleton className='w-full h-[100px]' />
                        <Skeleton className='w-full h-[100px]' />
                        <Skeleton className='w-full h-[100px]' />
                    </div> : orders && orders.length > 0 && orders.map((order: Order & { items: OrderItem[] }) => (
                        <SingleOrder key={order.id} order={order} dashboard={true} refetch={refetch} />
                    ))
                }
            </div>
        </div>
    )
}

export default AllOrdersPage