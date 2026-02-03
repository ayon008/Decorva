'use client'
import React, { useState, useEffect, useRef } from 'react'

export type ShippingData = {
    weight: string
    width: string
    height: string
    depth: string
    shippingClass: string
}

const Shipping = ({ setShippingData, defaultData }: { setShippingData: (data: ShippingData) => void; defaultData?: Partial<ShippingData> | null }) => {
    const [weight, setWeight] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [depth, setDepth] = useState('')
    const [shippingClass, setShippingClass] = useState('')
    const hasSyncedRef = useRef(false)

    useEffect(() => {
        if (!defaultData || hasSyncedRef.current) return
        hasSyncedRef.current = true
        queueMicrotask(() => {
            if (defaultData.weight != null) setWeight(String(defaultData.weight))
            if (defaultData.width != null) setWidth(String(defaultData.width))
            if (defaultData.height != null) setHeight(String(defaultData.height))
            if (defaultData.depth != null) setDepth(String(defaultData.depth))
            if (defaultData.shippingClass != null) setShippingClass(String(defaultData.shippingClass))
        })
    }, [defaultData])

    useEffect(() => {
        setShippingData({
            weight,
            width,
            height,
            depth,
            shippingClass,
        })
    }, [weight, width, height, depth, shippingClass, setShippingData])

    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="shipping" className='text-xs'>Weight (Kg)</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input min={0} type='number' id='weight' placeholder='Weight' className='border px-2 py-1 border-black/30 rounded-sm w-full' value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="shipping" className='text-xs'>Dimensions (cm)</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='number' id='width' placeholder='Width' className='border px-2 py-1 border-black/30 rounded-sm w-full' value={width} onChange={(e) => setWidth(e.target.value)} />
                    <input type='number' id='height' placeholder='Height' className='border px-2 py-1 border-black/30 rounded-sm w-full' value={height} onChange={(e) => setHeight(e.target.value)} />
                    <input type='number' id='depth' placeholder='Depth' className='border px-2 py-1 border-black/30 rounded-sm w-full' value={depth} onChange={(e) => setDepth(e.target.value)} />
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="shipping" className='text-xs'>Shipping class</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <select title='shipping-class' name="shipping-class" id="shipping-class" className='border px-2 py-1 border-black/30 rounded-sm w-full' value={shippingClass} onChange={(e) => setShippingClass(e.target.value)}>
                        <option disabled value="">Select a shipping class</option>
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Shipping
