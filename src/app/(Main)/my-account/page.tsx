'use client'
import PageTitle from '@/Shared/PageTitle/PageTitle';
import React, { useState } from 'react'
import Orders from '../../../Shared/Orders/Orders';
import ForgotPass from '@/Shared/ForgotPassword/ForgotPass';
import Information from '@/Shared/My-Profile/Information';
import { signOut, useSession } from "next-auth/react";
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { User } from "@prisma/client";

const MyAccountPage = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
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

    const { data: user = {}, isLoading } = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await fetch(`/api/user/${id}`);
            const data = await response.json();
            if (data.success) {
                return data.data;
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
                    <div className='max-w-[300px] w-full sticky top-[100px]'>
                        <ul className='flex flex-col gap-2'>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 0 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(0)}>Information</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 1 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(1)}>Order</li>
                            <li className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 2 ? 'bg-primary' : 'bg-[#222222]'}`} onClick={() => setActiveIndex(2)}>Forgot Password</li>
                            <li onClick={() => handleLogOut()} className={`text-white py-3 px-4 rounded-sm font-medium cursor-pointer hover:bg-primary transition-all duration-200 ease-in ${activeIndex === 3 ? 'bg-primary' : 'bg-[#222222]'}`}>Logout</li>
                        </ul>
                    </div>
                    <div className={`flex-1 ${isLoading || !user ? 'opacity-0' : 'opacity-100'}`}>
                        {activeIndex === 0 && <Information data={user as User} />}
                        {activeIndex === 1 && <Orders />}
                        {activeIndex === 2 && <ForgotPass />}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MyAccountPage;