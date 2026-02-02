import React from 'react'
import Skeleton from '@/Shared/Loader/Skeleton'

const ProductLoader = () => {
    return (
        <div className='h-[358px] w-full'>
            <Skeleton className='h-[272px] w-full' />
            <div className='flex flex-col gap-2 mt-2'>
                <Skeleton className="w-1/3 h-[15px] mx-auto" />
                <Skeleton className="w-1/2 h-[15px] mx-auto" />
                <Skeleton className="w-1/3 h-[15px] mx-auto" />
            </div>
        </div>
    )
}

export default ProductLoader;