import Link from 'next/link'
import React from 'react'

const AllProductsPage = () => {
    return (
        <div className='flex flex-col gap-4 '>
            <div className='flex items-center gap-4'>
                <span className='text-2xl font-semibold'>
                    Products
                </span>
                <button type='button' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'>
                    <Link href='/dashboard/products/add'>
                        Add new product
                    </Link>
                </button>
            </div>
            <div className='flex items-center gap-2'>
                <select title='Select a category' className='border border-black/30 rounded-sm p-2'>
                    <option value='all'>Select a category</option>
                    <option value='uncategorised'>Uncategorised</option>
                </select>
                <select title='Filter by Product Type' className='border border-black/30 rounded-sm p-2'>
                    <option value='all'>Select a product type</option>
                    <option value='simple'>Simple</option>
                    <option value='variable'>Variable</option>
                </select>
                <select title='Filter by Stock Status' className='border border-black/30 rounded-sm p-2'>
                    <option value='all'>Select a stock status</option>
                    <option value='in-stock'>In Stock</option>
                    <option value='out-of-stock'>Out of Stock</option>
                </select>
                <select title='Filter by Brand' className='border border-black/30 rounded-sm p-2'>
                    <option value='all'>Select a brand</option>
                    <option value='brand-1'>Brand 1</option>
                    <option value='brand-2'>Brand 2</option>
                    <option value='brand-3'>Brand 3</option>
                </select>
            </div>
        </div>
    )
}

export default AllProductsPage