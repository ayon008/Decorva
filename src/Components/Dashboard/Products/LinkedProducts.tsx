'use client'
import React, { useState, useEffect } from 'react'

export type LinkedProductsData = {
    upsells: string
    crossSells: string
}

const LinkedProducts = ({ setLinkedProductsData }: { setLinkedProductsData: (data: LinkedProductsData) => void }) => {
    const [upsells, setUpsells] = useState('')
    const [crossSells, setCrossSells] = useState('')

    useEffect(() => {
        setLinkedProductsData({ upsells, crossSells })
    }, [upsells, crossSells, setLinkedProductsData])

    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="linked-products-upsells" className='text-xs'>Upsells</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='text' id='linked-products-upsells' placeholder='Search for a product' className='border px-2 py-1 border-black/30 rounded-sm w-full' value={upsells} onChange={(e) => setUpsells(e.target.value)} />
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="linked-products-crosssells" className='text-xs'>Cross-sells</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='text' id='linked-products-crosssells' placeholder='Search for a product' className='border px-2 py-1 border-black/30 rounded-sm w-full' value={crossSells} onChange={(e) => setCrossSells(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

export default LinkedProducts
