"use client"
import React, { useState } from 'react'
import { Pen } from 'lucide-react';
import { ShippingAddress, User } from '@prisma/client';
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from 'sweetalert2';

type ExtendedUser = User & {
    shippingAddress?: ShippingAddress | null;
}

const ForthForm = ({ data: user }: { data: ExtendedUser }) => {
    const [show, setShow] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddress>({
        defaultValues: {
            address1: user.shippingAddress?.address1 ?? "",
            address2: user.shippingAddress?.address2 ?? "",
            city: user.shippingAddress?.city ?? "",
            state: user.shippingAddress?.state ?? "",
            postcode: user.shippingAddress?.postcode ?? "",
            country: user.shippingAddress?.country ?? "",
        }
    });

    const onSubmit: SubmitHandler<ShippingAddress> = async (values: ShippingAddress) => {
        Swal.fire({
            title: 'Please wait',
            text: 'Updating shipping address...',
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
                body: JSON.stringify({ shippingAddress: values }),
            });
            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    title: 'Success',
                    text: 'Shipping address updated successfully',
                    icon: 'success',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while updating shipping address',
                icon: 'error',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex items-center justify-between pb-1 global-b-bottom'>
                <h3 className='text-lg leading-[100%]'>Shipping Address</h3>
                <div
                    onClick={() => setShow(!show)}
                    className='flex items-center gap-2 text-sm leading-[100%] cursor-pointer'
                >
                    <Pen className='w-4 h-4 cursor-pointer' />
                    Edit
                </div>
            </div>

            <div className={`mt-1 grid grid-cols-2 gap-4 ${show ? 'opacity-100' : 'opacity-50'}`}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="address1" className='text-sm font-medium'>Address 1 <span className='text-red-500'>*</span></label>
                    <input
                        id="address1"
                        type="text"
                        placeholder='Enter address 1'
                        {...register("address1", { required: 'Address 1 is required' })}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                    />
                    {errors.address1 && <p className='text-red-500'>{errors.address1.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="address2" className='text-sm font-medium'>Address 2</label>
                    <input
                        id="address2"
                        type="text"
                        placeholder='Enter address 2'
                        {...register("address2")}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="city" className='text-sm font-medium'>City <span className='text-red-500'>*</span></label>
                    <input
                        id="city"
                        type="text"
                        placeholder='Enter city'
                        {...register("city", { required: 'City is required' })}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                    />
                    {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="state" className='text-sm font-medium'>State <span className='text-red-500'>*</span></label>
                    <input
                        id="state"
                        type="text"
                        placeholder='Enter state'
                        {...register("state", { required: 'State is required' })}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                    />
                    {errors.state && <p className='text-red-500'>{errors.state.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="postcode" className='text-sm font-medium'>Postcode <span className='text-red-500'>*</span></label>
                    <input
                        id="postcode"
                        type="text"
                        placeholder='Enter postcode'
                        {...register("postcode", { required: 'Postcode is required' })}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                    />
                    {errors.postcode && <p className='text-red-500'>{errors.postcode.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="country" className='text-sm font-medium'>Country <span className='text-red-500'>*</span></label>
                    <input
                        id="country"
                        type="text"
                        placeholder='Enter country'
                        {...register("country", { required: 'Country is required' })}
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                    />
                    {errors.country && <p className='text-red-500'>{errors.country.message}</p>}
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
    )
}

export default ForthForm;
