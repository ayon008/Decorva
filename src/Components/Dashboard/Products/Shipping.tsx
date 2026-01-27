import React from 'react'

const Shipping = () => {
    return (
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-6'>
                <label htmlFor="shipping" className='text-xs'>Weight (Kg)</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='number' id='weight' placeholder='Weight' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="shipping" className='text-xs'>Dimensions (cm)</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <input type='number' id='width' placeholder='Width' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                    <input type='number' id='height' placeholder='Height' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                    <input type='number' id='depth' placeholder='Depth' className='border px-2 py-1 border-black/50 rounded-sm w-full' />
                </div>
            </div>
            <div className='flex items-center gap-6'>
                <label htmlFor="shipping" className='text-xs'>Shipping class</label>
                <div className='flex items-center gap-2 w-full max-w-[300px] ml-auto'>
                    <select title='shipping-class' name="shipping-class" id="shipping-class" className='border px-2 py-1 border-black/50 rounded-sm w-full'>
                        <option disabled selected value="">Select a shipping class</option>
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