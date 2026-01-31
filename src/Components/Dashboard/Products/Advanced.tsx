'use client'
import React, { useState, useEffect, useRef } from 'react'

export type AdvancedData = {
    purchaseNote: string
    enableReviews: boolean
}

const Advanced = ({ setAdvancedData, defaultData }: { setAdvancedData: (data: AdvancedData) => void; defaultData?: Partial<AdvancedData> | null }) => {
    const [purchaseNote, setPurchaseNote] = useState('')
    const [enableReviews, setEnableReviews] = useState(false)
    const hasSyncedRef = useRef(false)

    useEffect(() => {
        if (!defaultData || hasSyncedRef.current) return
        hasSyncedRef.current = true
        queueMicrotask(() => {
            if (defaultData.purchaseNote != null) setPurchaseNote(String(defaultData.purchaseNote))
            if (defaultData.enableReviews != null) setEnableReviews(defaultData.enableReviews)
        })
    }, [defaultData])

    useEffect(() => {
        setAdvancedData({ purchaseNote, enableReviews })
    }, [purchaseNote, enableReviews, setAdvancedData])

    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-start gap-6'>
                <label htmlFor="advanced-note" className='text-xs'>Purchase Note</label>
                <textarea name="advanced" id="advanced-note" placeholder='Purchase Note' className='border px-2 py-1 border-black/30 rounded-sm w-full max-w-[300px] placeholder:text-xs' value={purchaseNote} onChange={(e) => setPurchaseNote(e.target.value)} />
            </div>
            <div className='flex items-start gap-6'>
                <label htmlFor="advanced-reviews" className='text-xs'>Enable Reviews</label>
                <input type="checkbox" name="advanced" id="advanced-reviews" checked={enableReviews} onChange={(e) => setEnableReviews(e.target.checked)} />
            </div>
        </div>
    )
}

export default Advanced
