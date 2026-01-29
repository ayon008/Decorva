/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'

export type GeneralData = {
    regularPrice: string
    salePrice: string
    startDate: string
    endDate: string
}

const General = ({ setGeneralData }: { setGeneralData: (data: GeneralData) => void }) => {
    const [show, setShow] = useState<boolean>(false)
    const [regularPrice, setRegularPrice] = useState<string>('')
    const [salePrice, setSalePrice] = useState<string>('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')

    useEffect(() => {
        setGeneralData({
            regularPrice,
            salePrice,
            startDate,
            endDate,
        })
    }, [regularPrice, salePrice, startDate, endDate, setGeneralData])

    return (
        <div className='p-3 space-y-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="regular-price" className='text-xs'>Regular Price</label>
                <input
                    type="text"
                    id="regular-price"
                    placeholder='Regular price'
                    className='border px-2 py-1 ml-auto border-black/30 rounded-sm max-w-[300px] w-full'
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                />
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="sale-price" className='text-xs'>Sale Price</label>
                <input
                    type="text"
                    id="sale-price"
                    placeholder='Sale price'
                    className='border px-2 py-1 border-black/30 rounded-sm w-full ml-auto max-w-[300px]'
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                />
            </div>
            {
                show && (
                    <div className='flex flex-col gap-4 max-w-[300px] w-full ml-auto'>
                        <input
                            type="text"
                            id="start-date"
                            placeholder='Start date'
                            className='border px-2 py-1 border-black/30 rounded-sm w-full'
                            value={startDate}
                            onFocus={(e) => { e.currentTarget.type = "date"; }}
                            onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text"; }}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            type="text"
                            id="end-date"
                            placeholder='End date'
                            className='border px-2 py-1 border-black/30 rounded-sm w-full'
                            value={endDate}
                            onFocus={(e) => { e.currentTarget.type = "date"; }}
                            onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text"; }}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                )
            }
            <p className='text-primary text-xs cursor-pointer mt-1 ml-auto max-w-[300px] w-full' onClick={() => setShow(!show)}>{show ? 'Cancel' : 'Schedule'}</p>
        </div>
    )
}
export default General; 