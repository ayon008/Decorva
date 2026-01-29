'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import loginImage from "@/../public/login-image.png"
import { lora } from '@/Shared/font/Rubik';
import Link from 'next/link';
import { ArrowLeft, EyeIcon, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginFormSchema } from '@/Shared/Schema/LoginSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { signIn } from 'next-auth/react';

export type LoginFormData = z.infer<typeof LoginFormSchema>;

const LoginPage = () => {
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(LoginFormSchema),
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    console.log(callbackUrl);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onSubmit = async (data: LoginFormData) => {
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: result.message,
                showConfirmButton: false,
                timer: 2000,
            });
            reset();
            router.push(callbackUrl);
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: result.message,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    return (
        <div className='w-hull h-dvh flex bg-[#F1FAEC] relative overflow-hidden'>
            <Image src={loginImage} width={1000} height={1000} alt='login-Decorva' className='aspect-auto object-contain absolute left-0 bottom-0 lg:w-[750px] 2xl:w-[1000px]' />
            <div className='layout global-padding z-10 py-10 flex items-stretch justify-between gap-10'>
                <div className='w-1/2'>
                    <h1 className={`${lora.className} global-h1 text-[#394233]`}>
                        <Link href='/'>Decorva</Link>
                    </h1>
                </div>
                <div className='w-1/2 flex flex-col gap-4 my-auto max-w-[500px]'>
                    <h2 className={`global-h2 ${lora.className} font-semibold!`}>Login</h2>
                    <div className='flex items-center justify-between'>
                        <p className='text-xl leading-[24px] text-black'>Get access to your account</p>
                        <button
                            type='button'
                            onClick={() => router.back()}
                            className='flex items-center gap-2 hover:text-primary transition-colors duration-300 cursor-pointer'
                        >
                            <ArrowLeft className='w-4 h-4' /> Back
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                        <div>
                            <input
                                type='email'
                                id='email'
                                placeholder='Enter your email'
                                className='w-full p-4 rounded-sm border border-black/70 placeholder:text-base text-base'
                                {...register('email')}
                            />
                            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                        </div>
                        <div>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    placeholder='Enter your password'
                                    className='w-full p-4 rounded-sm border border-black/70 placeholder:text-base text-base'
                                    {...register('password')}
                                />
                                {showPassword ?
                                    <EyeIcon className='w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(!showPassword)} /> :
                                    <EyeOff className='w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                                }
                            </div>
                            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                        </div>
                        <button className='w-full bg-primary text-white py-3 px-4 rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]' type='submit'>Login</button>
                    </form>
                    <p className='text-center'>Don&apos;t have an account? <Link href='/register' className='text-primary'>Register</Link></p>
                    <span className='text-center text-base font-medium leading-[24px] text-black'>Or</span>
                    <div onClick={() => signIn('google', { callbackUrl: '/' })} className='flex items-center justify-center gap-2'>
                        <button type='button' className='w-full bg-white text-black py-3 px-4 rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2' title='Google'>
                            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            <span>Login with Google</span>
                        </button>
                    </div>
                    <p className='text-center'>Forgot your password? <Link href='/forgot-password' className='text-primary'>Reset Password</Link></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;