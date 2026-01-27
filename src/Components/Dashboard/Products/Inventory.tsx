
"use client";
import React, { useState } from 'react'

const Inventory = () => {
    const [trackStock, setTrackStock] = useState(false);

    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="inventory" className='text-xs'>SKU</label>
                <input type="text" id="inventory" placeholder='Inventory' className='border px-2 py-1 ml-auto border-black/50 rounded-sm max-w-[300px] w-full' />
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
                        <input type='number' id='quantity' placeholder='Quantity' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                    </div>
                </div>
            )}
            <div className='flex items-start justify-between gap-2'>
                <label htmlFor="inventory" className='text-xs'>Stock Status</label>
                <div className='flex flex-col items-start gap-2 w-full max-w-[300px] ml-auto'>
                    <div className='flex items-center gap-2'>
                        <input type='radio' id='in-stock' name='stock-status' className='w-3 h-3 cursor-pointer' />
                        <label htmlFor='in-stock' className='text-sm'>In Stock</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='radio' id='out-of-stock' name='stock-status' className='w-3 h-3 cursor-pointer' />
                        <label htmlFor='out-of-stock' className='text-sm'>Out of Stock</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='radio' id='low-stock' name='stock-status' className='w-3 h-3 cursor-pointer' />
                        <label htmlFor='low-stock' className='text-sm'>Low Stock</label>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="sold-individually" className='text-xs'>Sold individually</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='checkbox' id='sold-individually' className='w-3 h-3 cursor-pointer' />
                    <label htmlFor='sold-individually' className='text-sm'>Limit purchases to 1 item per order</label>
                </div>
            </div>
        </div>
    )
}

export default Inventory