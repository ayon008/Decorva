import React from 'react'

const Advanced = () => {
    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-start gap-6'>
                <label htmlFor="advanced" className='text-xs'>Purchase Note</label>
                <textarea name="advanced" id="advanced" placeholder='Purchase Note' className='border px-2 py-1 border-black/50 rounded-sm w-full max-w-[300px] placeholder:text-xs' />
            </div>
            <div className='flex items-start gap-6'>
                <label htmlFor="advanced" className='text-xs'>Enable Reviews</label>
                <input type="checkbox" name="advanced" id="advanced" />
            </div>
        </div>
    )
}

export default Advanced
