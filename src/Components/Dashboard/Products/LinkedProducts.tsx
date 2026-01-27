import React from 'react'

const LinkedProducts = () => {
    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="linked-products" className='text-xs'>Upsells</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='text' id='linked-products' placeholder='Search for a product' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="linked-products" className='text-xs'>Cross-sells</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='text' id='linked-products' placeholder='Search for a product' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                </div>
            </div>
        </div>
    )
}

export default LinkedProducts