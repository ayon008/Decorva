'use client'
import PageTitle from '@/Shared/PageTitle/PageTitle';
import React, { useState } from 'react'

const MyAccountPage = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    return (
        <div>
            <PageTitle title='My Account' subTitle='home / My account' />
            <section className='layout global-padding lg:my-20 my-10'>
                <div className='flex items-start justify-center gap-10 w-full'>
                    <div className='max-w-[300px] w-full'>
                        <ul className='flex flex-col gap-2'>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 0 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(0)}>Information</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 1 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(1)}>Order</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 2 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(2)}>Forgot Password</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 3 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(3)}>Logout</li>
                        </ul>
                    </div>
                    <div className='flex-1 bg-blue-400'>A</div>
                </div>
            </section>
        </div>
    )
}

export default MyAccountPage;