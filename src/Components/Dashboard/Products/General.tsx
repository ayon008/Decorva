'use client'
import React, { useState } from 'react'

const General = () => {
    const [show, setShow] = useState<boolean>(false)
    return (
        <div className='p-3 space-y-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="regular-price" className='text-xs'>Regular Price</label>
                <input type="text" id="regular-price" placeholder='Regular price' className='border px-2 py-1 ml-auto border-black/50 rounded-sm max-w-[300px] w-full' />
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="sale-price" className='text-xs'>Sale Price</label>
                <input type="text" id="sale-price" placeholder='Sale price' className='border px-2 py-1 border-black/50 rounded-sm w-full ml-auto max-w-[300px]' />
            </div>
            {
                show && (
                    <div className='flex flex-col gap-4 max-w-[300px] w-full ml-auto'>
                        <input
                            type="text"
                            id="start-date"
                            placeholder='Start date'
                            className='border px-2 py-1 border-black/50 rounded-sm w-full'
                            onFocus={(e) => { e.currentTarget.type = "date"; }}
                            onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text"; }}
                        />
                        <input
                            type="text"
                            id="end-date"
                            placeholder='End date'
                            className='border px-2 py-1 border-black/50 rounded-sm w-full'
                            onFocus={(e) => { e.currentTarget.type = "date"; }}
                            onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text"; }}
                        />
                    </div>
                )
            }
            <p className='text-primary text-xs cursor-pointer mt-1 ml-auto max-w-[300px] w-full' onClick={() => setShow(!show)}>{show ? 'Cancel' : 'Schedule'}</p>
        </div>
    )
}
export default General; 