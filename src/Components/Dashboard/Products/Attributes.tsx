'use client'
import React, { useState, useEffect } from 'react'

export type AttributesData = {
    searchAttribute: string
}

const Attributes = ({ setAttributesData }: { setAttributesData: (data: AttributesData) => void }) => {
    const [searchAttribute, setSearchAttribute] = useState('')

    useEffect(() => {
        setAttributesData({ searchAttribute })
    }, [searchAttribute, setAttributesData])

    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <button
                    type="button"
                    className="border border-primary bg-white text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer px-4 py-2 rounded-sm text-xs"
                >
                    Add New
                </button>
                <input type="text" placeholder='Search for an attribute' className='border px-2 py-1 border-black/30 rounded-sm w-full max-w-[150px] placeholder:text-xs' value={searchAttribute} onChange={(e) => setSearchAttribute(e.target.value)} />
            </div>
        </div>
    )
}

export default Attributes
