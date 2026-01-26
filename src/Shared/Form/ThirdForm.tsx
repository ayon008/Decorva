"use client"
import React, { useState, useEffect } from 'react';
import { Pen } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User, BillingAddress } from '@prisma/client';
import Swal from 'sweetalert2';

type UserWithBillingAddress = User & {
    billingAddress?: BillingAddress | null;
};

const ThirdForm = ({ data: user }: { data: UserWithBillingAddress }) => {
    const [show, setShow] = useState<boolean>(false);


    console.log(user);

    // 1️⃣ Setup React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm<BillingAddress>({
        defaultValues: {
            firstName: user?.billingAddress?.firstName || user?.firstName || '',
            lastName: user?.billingAddress?.lastName || user?.lastName || '',
            address1: user?.billingAddress?.address1 || '',
            address2: user?.billingAddress?.address2 || '',
            city: user?.billingAddress?.city || '',
            state: user?.billingAddress?.state || '',
            postcode: user?.billingAddress?.postcode || '',
            country: user?.billingAddress?.country || '',
            phone: user?.billingAddress?.phone || '',
            email: user?.billingAddress?.email || '',
        },
    });

    // Mettre à jour les valeurs du formulaire quand user change
    useEffect(() => {
        if (user) {
            reset({
                firstName: user?.billingAddress?.firstName || user?.firstName || '',
                lastName: user?.billingAddress?.lastName || user?.lastName || '',
                address1: user?.billingAddress?.address1 || '',
                address2: user?.billingAddress?.address2 || '',
                city: user?.billingAddress?.city || '',
                state: user?.billingAddress?.state || '',
                postcode: user?.billingAddress?.postcode || '',
                country: user?.billingAddress?.country || '',
                phone: user?.billingAddress?.phone || '',
                email: user?.billingAddress?.email || '',
            });
        }
    }, [user, reset]);

    // 2️⃣ Submit handler
    const onSubmit: SubmitHandler<BillingAddress> = async (data) => {
        Swal.fire({
            title: 'Please wait',
            text: 'Updating billing address...',
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
                body: JSON.stringify({ billingAddress: data }),
            });
            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    title: 'Success',
                    text: 'Billing address updated successfully',
                    icon: 'success',
                });
            }
            else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update billing address',
                icon: 'error',
            });
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex items-center justify-between pb-1 global-b-bottom'>
                <h3 className='text-lg leading-[100%]'>Billing Address</h3>
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
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('address1', { required: 'Address 1 is required' })}
                    />
                    {errors.address1 && <p className='text-red-500'>{errors.address1.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="address2" className='text-sm font-medium'>Address 2</label>
                    <input
                        id="address2"
                        type="text"
                        placeholder='Enter address 2'
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('address2')}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="city" className='text-sm font-medium'>City <span className='text-red-500'>*</span></label>
                    <input
                        id="city"
                        type="text"
                        placeholder='Enter city'
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="state" className='text-sm font-medium'>State <span className='text-red-500'>*</span></label>
                    <input
                        id="state"
                        type="text"
                        placeholder='Enter state'
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('state', { required: 'State is required' })}
                    />
                    {errors.state && <p className='text-red-500'>{errors.state.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="postcode" className='text-sm font-medium'>Postcode <span className='text-red-500'>*</span></label>
                    <input
                        id="postcode"
                        type="text"
                        placeholder='Enter postcode'
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('postcode', { required: 'Postcode is required' })}
                    />
                    {errors.postcode && <p className='text-red-500'>{errors.postcode.message}</p>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="country" className='text-sm font-medium'>Country <span className='text-red-500'>*</span></label>
                    <input
                        id="country"
                        type="text"
                        placeholder='Enter country'
                        className='w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold'
                        {...register('country', { required: 'Country is required' })}
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
    );
};

export default ThirdForm;
