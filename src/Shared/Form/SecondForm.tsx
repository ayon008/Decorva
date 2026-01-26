"use client"
import React, { useState, useEffect } from 'react';
import { Pen } from 'lucide-react';
import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const SecondForm = ({ data: user }: { data: User }) => {
    const [show, setShow] = useState<boolean>(false);

    // 1️⃣ Setup React Hook Form
    type FormValues = {
        phone: string;
        email: string;
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            phone: user?.phone || '',
            email: user?.email || '',
        },
    });

    // Mettre à jour les valeurs du formulaire quand user change
    useEffect(() => {
        if (user) {
            reset({
                phone: user.phone || '',
                email: user.email || '',
            });
        }
    }, [user, reset]);

    // 2️⃣ Submit handler
    const onSubmit = async (data: FormValues) => {
        Swal.fire({
            title: 'Please wait',
            text: 'Updating user...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
        });
        try {
            const response = await fetch(`/api/user/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: data.phone || undefined,
                    email: data.email || undefined,
                }),
            });
            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    title: 'Success',
                    text: 'User updated successfully',
                    icon: 'success',
                });
                setShow(false);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to update user',
                icon: 'error',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex items-center justify-between pb-1 global-b-bottom'>
                <h3 className='text-lg leading-[100%]'>Contact info</h3>
                <div
                    onClick={() => setShow(!show)}
                    className='flex items-center gap-2 text-sm leading-[100%] cursor-pointer'
                >
                    <Pen className='w-4 h-4 cursor-pointer' />
                    Edit
                </div>
            </div>

            <div className={`mt-1 grid grid-cols-2 gap-4 ${!show ? 'opacity-50' : ''}`}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="phone" className='text-sm font-medium'>
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phone"
                        type="text"
                        placeholder='Enter phone'
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        disabled={!show}
                        {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^\+?[0-9]+$/, // optional + at start, then digits
                                message: 'Phone must be a number'
                            }
                        })}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div className='flex flex-col gap-2 opacity-80'>
                    <label htmlFor="email" className='text-sm font-medium'>
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder='Enter email'
                        disabled={true}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('email', { required: true, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email must be a valid email' } })}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
            </div>

            {show && (
                <button
                    type='submit'
                    className='w-full bg-primary text-white py-3 px-4 rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'
                >
                    Save Changes
                </button>
            )}
        </form>
    );
};

export default SecondForm;
