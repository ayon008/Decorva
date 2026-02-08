'use client'
import PageTitle from '@/Shared/PageTitle/PageTitle';
import React, { useState } from 'react';
import Orders from '../../../Shared/Orders/Orders';
import ForgotPass from '@/Shared/ForgotPassword/ForgotPass';
import Information from '@/Shared/My-Profile/Information';
import { signOut, useSession } from "next-auth/react";
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import type { User } from "@prisma/client";
import Skeleton from '@/Shared/Loader/Skeleton';
import { useSearchParams } from 'next/navigation';
import { LogOut, Package2, User as UserIcon } from 'lucide-react';

const MyAccountPage = () => {
    const searchParams = useSearchParams();
    const order = searchParams.get('order');
    const [activeIndex, setActiveIndex] = useState<number>(order ? 1 : 0);

    const handleLogOut = async () => {
        Swal.fire({
            title: 'Logging out...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        await signOut({
            redirect: true,
            callbackUrl: '/'
        });
    }

    const { data: session } = useSession();
    const id = session?.user?.id;

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await fetch(`/api/user/${id}`);
            const data = await response.json();
            if (data.success) {
                return data.data as User;
            }
            return null;
        },
        enabled: !!id
    });

    return (
        <div>
            <PageTitle title='My Account' subTitle='home / My account' />
            <section className='layout global-padding lg:my-20 my-10'>
                <div className='flex items-start justify-center gap-10 w-full'>
                    <div className='max-w-[300px] w-full sticky top-[100px] md:block hidden'>
                        <ul className='flex flex-col gap-2'>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 0 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(0)}>Information</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 1 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(1)}>Order</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 2 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(2)}>Forgot Password</li>
                            <li onClick={() => handleLogOut()} className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 3 ? 'bg-primary' : 'bg-[#222222]'}`}>Logout</li>
                        </ul>
                    </div>
                    <div className='fixed bottom-0 left-0 right-0 md:hidden bg-[#F3F3F3] w-full z-[80]'>
                        <ul className='grid grid-cols-4 justify-between items-center p-2'>
                            <li onClick={() => setActiveIndex(0)} className={`flex flex-col gap-2 py-1 px-3 rounded-sm  items-center justify-center ${activeIndex === 0 ? 'bg-primary text-white' : 'text-black'}`}>
                                <UserIcon className='w-8 h-8' />
                                <span className='text-sm leading-[24px] font-medium text-center'>Infor...</span>
                            </li>
                            <li onClick={() => setActiveIndex(1)} className={`flex flex-col items-center py-1 px-3 rounded-sm justify-center gap-2 ${activeIndex === 1 ? 'bg-primary text-white' : ''}`}>
                                <Package2 className={`w-8 h-8`} />
                                <span className='text-sm leading-[24px] font-medium text-center'>Order</span>
                            </li>
                            <li onClick={() => setActiveIndex(2)} className={`flex flex-col items-center py-1 px-3 rounded-sm justify-center gap-2 ${activeIndex === 2 ? 'bg-primary text-white' : ''}`}>
                                <UserIcon className={`w-8 h-8`} />
                                <span className='text-sm leading-[24px] font-medium text-center'>Forg...</span>
                            </li>
                            <li onClick={() => handleLogOut()} className={`flex flex-col items-center py-1 px-3 rounded-sm justify-center gap-2 ${activeIndex === 3 ? 'bg-primary text-white' : ''}`}>
                                <LogOut className={`w-8 h-8`} />
                                <span className='text-sm leading-[24px] font-medium text-center'>Logout</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="text-center text-sm text-gray-500 flex flex-col gap-4">
                                <Skeleton className='h-[40px] w-[50%]' />
                                <Skeleton className='h-[40px] w-[80%]' />
                                <Skeleton className='h-[300px] w-full' />
                            </div>
                        ) : (
                            <>
                                {activeIndex === 0 && user && <Information data={user} />}
                                {activeIndex === 1 && <Orders />}
                                {activeIndex === 2 && <ForgotPass />}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MyAccountPage;