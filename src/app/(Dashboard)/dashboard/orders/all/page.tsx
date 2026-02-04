'use client'
import Skeleton from '@/Shared/Loader/Skeleton';
import SingleOrder from '@/Shared/Orders/SingleOrder';
import { Order, OrderItem, OrderStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
const AllOrdersPage = () => {

    const { data: orders = [] as (Order & { items: OrderItem[] })[], isLoading, refetch } = useQuery({
        queryKey: ['allOrders'],
        queryFn: async () => {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (data.success) {
                return data.data;
            }
            return null;
        }
    })


    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredOrders = orders.filter((order: Order & { items: OrderItem[] }) => {
        if (selectedStatus === 'all') return orders;
        return order.status === (selectedStatus as OrderStatus);
    });

    return (
        <div>
            <header className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Manage Orders</h2>
                <select aria-label='status' className='p-2 rounded-sm border border-black/30' value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}>
                    <option value="all">All</option>
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.PROCESSING}>Processing</option>
                    <option value={OrderStatus.ON_HOLD}>On Hold</option>
                    <option value={OrderStatus.COMPLETED}>Completed</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                    <option value={OrderStatus.REFUNDED}>Refunded</option>
                    <option value={OrderStatus.FAILED}>Failed</option>
                </select>
            </header>
            <div className="flex flex-col gap-4">
                {
                    isLoading ? <div className='flex flex-col gap-4'>
                        <Skeleton className='w-full h-[100px]' />
                        <Skeleton className='w-full h-[100px]' />
                        <Skeleton className='w-full h-[100px]' />
                    </div> : filteredOrders && filteredOrders.length > 0 && filteredOrders.map((order: Order & { items: OrderItem[] }) => (
                        <SingleOrder key={order.id} order={order} dashboard={true} refetch={refetch} />
                    ))
                }
            </div>
        </div>
    )
}

export default AllOrdersPage