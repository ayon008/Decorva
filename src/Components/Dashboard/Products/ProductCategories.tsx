'use client'
import React, { useState } from 'react'

const ProductCategories = () => {
    const [allCategories, setAllCategories] = useState<boolean>(false);

    console.log(allCategories);

    return (
        <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
            <div className='text-base border-b border-b-black/30 pb-2'>
                Product Categories
            </div>
            <div className='mt-1'>
                <div className='flex flex-col gap-2 border border-black/30 rounded-sm p-2'>
                    <span className='text-xs cursor-pointer'>All Categories</span>
                    <label htmlFor='all-categories' className='flex items-center gap-2 cursor-pointer'>
                        <input id='all-categories' type='checkbox' className='w-3 h-3' title='All Categories' />
                        <span className='text-xs'>Unknown</span>
                    </label>
                </div>
            </div>
            <div className='text-primary cursor-pointer text-xs' onClick={() => setAllCategories(!allCategories)}>
                + Add new category
            </div>
        </div>
    )
}

export default ProductCategories