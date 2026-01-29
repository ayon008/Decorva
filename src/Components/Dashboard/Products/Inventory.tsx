"use client";
import React, { useState, useEffect } from 'react'

export type InventoryData = {
    sku: string
    trackStock: boolean
    quantity: string
    stockStatus: string
    soldIndividually: boolean
}

const Inventory = ({ setInventoryData }: { setInventoryData: (data: InventoryData) => void }) => {
    const [trackStock, setTrackStock] = useState(false);
    const [sku, setSku] = useState('');
    const [quantity, setQuantity] = useState('');
    const [stockStatus, setStockStatus] = useState('');
    const [soldIndividually, setSoldIndividually] = useState(false);

    useEffect(() => {
        setInventoryData({
            sku,
            trackStock,
            quantity,
            stockStatus,
            soldIndividually,
        });
    }, [sku, trackStock, quantity, stockStatus, soldIndividually, setInventoryData]);

    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="inventory" className='text-xs'>SKU</label>
                <input
                    type="text"
                    id="inventory"
                    placeholder='Inventory'
                    className='border px-2 py-1 ml-auto border-black/30 rounded-sm max-w-[300px] w-full'
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="inventory" className='text-xs'>Stock management</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input
                        type='checkbox'
                        id='stock-management'
                        className='w-3 h-3 cursor-pointer'
                        checked={trackStock}
                        onChange={(e) => setTrackStock(e.target.checked)}
                    />
                    <label htmlFor='stock-management' className='text-sm'>Track stock quantity for this product</label>
                </div>
            </div>
            {trackStock && (
                <div className='flex items-center gap-6'>
                    <label htmlFor="quantity" className='text-xs'>Quantity</label>
                    <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                        <input
                            type='number'
                            id='quantity'
                            placeholder='Quantity'
                            className='border px-2 py-1 border-black/30 rounded-sm w-full'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <div className='flex items-start justify-between gap-2'>
                <label htmlFor="inventory" className='text-xs'>Stock Status</label>
                <div className='flex flex-col items-start gap-2 w-full max-w-[300px] ml-auto'>
                    <div className='flex items-center gap-2'>
                        <input type='radio' id='in-stock' name='stock-status' className='w-3 h-3 cursor-pointer' checked={stockStatus === 'in-stock'} onChange={() => setStockStatus('in-stock')} />
                        <label htmlFor='in-stock' className='text-sm'>In Stock</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='radio' id='out-of-stock' name='stock-status' className='w-3 h-3 cursor-pointer' checked={stockStatus === 'out-of-stock'} onChange={() => setStockStatus('out-of-stock')} />
                        <label htmlFor='out-of-stock' className='text-sm'>Out of Stock</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='radio' id='low-stock' name='stock-status' className='w-3 h-3 cursor-pointer' checked={stockStatus === 'low-stock'} onChange={() => setStockStatus('low-stock')} />
                        <label htmlFor='low-stock' className='text-sm'>Low Stock</label>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="sold-individually" className='text-xs'>Sold individually</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='checkbox' id='sold-individually' className='w-3 h-3 cursor-pointer' checked={soldIndividually} onChange={(e) => setSoldIndividually(e.target.checked)} />
                    <label htmlFor='sold-individually' className='text-sm'>Limit purchases to 1 item per order</label>
                </div>
            </div>
        </div>
    )
}

export default Inventory
