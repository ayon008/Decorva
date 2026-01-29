'use client'
import React, { useState } from 'react'

const ProductCategories = () => {
    const [newCategory, setNewCategory] = useState<boolean>(false);

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
            <div className='text-primary cursor-pointer text-xs' onClick={() => setNewCategory(!newCategory)}>
                + Add new category
            </div>
            {
                newCategory && (
                    <div className='flex flex-col gap-2'>
                        <input type='text' placeholder='Category name' className='border border-black/30 rounded-sm p-2' title='Category name' />
                        <select name='category-parent' id='category-parent' className='border border-black/30 rounded-sm p-2' title='Category parent'>
                            <option value=''>Select a parent category</option>
                            <option value='unknown'>Unknown</option>
                        </select>
                        <button type='button' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'>Add new category</button>
                    </div>
                )
            }
        </div>
    )
}

export default ProductCategories