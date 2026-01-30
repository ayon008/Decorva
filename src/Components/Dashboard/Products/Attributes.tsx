'use client'
import React, { useState, useEffect } from 'react'

export type AttributesData = {
    searchAttribute?: string
    attributeName?: string
    attributeValue?: string
}

const Attributes = ({ setAttributesData }: { setAttributesData: (data: AttributesData) => void }) => {
    const [searchAttribute, setSearchAttribute] = useState('')
    const [newAttribute, setNewAttribute] = useState<boolean>(false)

    useEffect(() => {
        setAttributesData({ searchAttribute })
    }, [searchAttribute, setAttributesData])



    const handleAddAttribute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const attributeName = e.currentTarget.elements.namedItem('attribute-name') as HTMLInputElement
        const attributeValue = e.currentTarget.elements.namedItem('attribute-value') as HTMLInputElement
        setAttributesData({ attributeName: attributeName.value, attributeValue: attributeValue.value })
        if (attributeName.value && attributeValue.value) {
            setNewAttribute(false)
        }
    }


    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <button
                    onClick={() => setNewAttribute(true)}
                    type="button"
                    className="border border-primary bg-white text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer px-4 py-2 rounded-sm text-xs"
                >
                    Add New
                </button>
                <input type="text" placeholder='Search for an attribute' className='border px-2 py-1 border-black/30 rounded-sm w-full max-w-[150px] placeholder:text-xs' value={searchAttribute} onChange={(e) => setSearchAttribute(e.target.value)} />
            </div>
            {/* <div className='flex items-center justify-between bg-white p-2 border border-black/30'>
                <div className='text-base'>
                    Size
                </div>
                <div>
                    <button type='button' className='text-red-500 text-xs cursor-pointer'>Remove</button>
                </div>
            </div> */}
            {
                newAttribute && (
                    <form onSubmit={handleAddAttribute} className='space-y-2'>
                        <div className='flex items-start gap-4 w-full'>
                            <div className='w-[30%]'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="attribute-name" className='text-xs'>Name:</label>
                                    <input type="text" id="attribute-name" placeholder='Attribute Name' className='border px-2 py-1 border-black/30 rounded-sm w-full placeholder:text-xs' />
                                </div>
                            </div>
                            <div className='w-[70%]'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="attribute-value" className='text-xs'>Value:</label>
                                    <input type="text" id="attribute-value" placeholder='Attribute Value (Use | to separate values)' className='border px-2 py-1 border-black/30 rounded-sm w-full placeholder:text-xs' />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className='border border-primary bg-white text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer px-4 py-2 rounded-sm text-xs'>Add</button>
                    </form>
                )
            }
        </div>
    )
}

export default Attributes
