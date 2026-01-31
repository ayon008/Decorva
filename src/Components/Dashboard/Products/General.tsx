'use client'
import React, { useState, useEffect, useRef } from 'react'

export type GeneralData = {
    regularPrice: string
    salePrice: string
    /** ISO 8601 DateTime string for Prisma DateTime */
    startDate: string
    /** ISO 8601 DateTime string for Prisma DateTime */
    endDate: string
}

const General = ({ setGeneralData, defaultData }: { setGeneralData: (data: GeneralData) => void; defaultData?: Partial<GeneralData> | null }) => {
    const [show, setShow] = useState<boolean>(false)
    const [regularPrice, setRegularPrice] = useState<string>('')
    const [salePrice, setSalePrice] = useState<string>('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const hasSyncedRef = useRef(false)

    useEffect(() => {
        if (!defaultData || hasSyncedRef.current) return
        hasSyncedRef.current = true
        queueMicrotask(() => {
            if (defaultData.regularPrice != null) setRegularPrice(String(defaultData.regularPrice))
            if (defaultData.salePrice != null) setSalePrice(String(defaultData.salePrice))
            if (defaultData.startDate != null) setStartDate(defaultData.startDate.includes('T') ? defaultData.startDate.slice(0, 16) : defaultData.startDate)
            if (defaultData.endDate != null) setEndDate(defaultData.endDate.includes('T') ? defaultData.endDate.slice(0, 16) : defaultData.endDate)
        })
    }, [defaultData])

    const toDateTimeISO = (value: string) =>
        value ? new Date(value).toISOString() : ''

    useEffect(() => {
        setGeneralData({
            regularPrice,
            salePrice,
            startDate: toDateTimeISO(startDate),
            endDate: toDateTimeISO(endDate),
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
                            type="datetime-local"
                            id="start-date"
                            aria-label="Sale start date and time"
                            className='border px-2 py-1 border-black/30 rounded-sm w-full'
                            value={startDate.includes('T') ? startDate.slice(0, 16) : startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            type="datetime-local"
                            id="end-date"
                            aria-label="Sale end date and time"
                            className='border px-2 py-1 border-black/30 rounded-sm w-full'
                            value={endDate.includes('T') ? endDate.slice(0, 16) : endDate}
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