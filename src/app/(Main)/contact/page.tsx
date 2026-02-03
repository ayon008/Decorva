'use client'

import PageTitle from '@/Shared/PageTitle/PageTitle';
import { Home, Mail, Phone } from 'lucide-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

type ContactFormValues = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

const ContactPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>();

    const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
        Swal.fire({
            title: 'Please wait',
            text: 'Sending message...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
        });
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (responseData.success) {
                Swal.fire({
                    title: 'Thank you for your message',
                    text: 'We will get back to you soon',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
            else {
                Swal.fire({
                    title: 'Error',
                    text: responseData.message,
                    icon: 'error',
                });
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to send message',
                icon: 'error',
            });
        }
    };
    return (
        <div>
            <PageTitle title="Contact" subTitle='Home / Contact' />
            <div className='w-full lg:my-20 my-10'>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25609.392765229644!2d90.38110201668327!3d23.875019210751837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c416ec497185%3A0x628e52943c152c40!2sZam%20Zam%20Tower!5e0!3m2!1sen!2sbd!4v1770107433616!5m2!1sen!2sbd"
                    className='w-full h-[450px]'
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            <div className='flex items-start gap-6 global-padding layout global-margin'>
                <div className='flex-1 flex flex-col gap-6'>
                    <h2 className='text-2xl font-bold'>Contact Us</h2>
                    <p className='text-sm leading-[130%]'>Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram anteposuerit litterarum formas human. qui sequitur mutationem consuetudium lectorum. Mirum est notare quam</p>
                    <ul className=''>
                        <li className='flex items-center gap-2 border-b border-t border-gray-300 py-4'>
                            <Home className='w-4 h-4' />
                            <span className='text-sm leading-[130%]'>Address: 123 Main St, Anytown, USA</span>
                        </li>
                        <li className='flex items-center gap-2 border-b border-t border-gray-300 py-4'>
                            <Mail className='w-4 h-4' />
                            <span className='text-sm leading-[130%]'>demo@example.com</span>
                        </li>
                        <li className='flex items-center gap-2 border-b border-t border-gray-300 py-4'>
                            <Phone className='w-4 h-4' />
                            <span className='text-sm leading-[130%]'>+8801726108060</span>
                        </li>
                    </ul>
                </div>
                <div className='flex-1 flex flex-col gap-6'>
                    <h2 className='text-2xl font-bold'>Send us a message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="name" className='text-sm font-medium'>Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                id="name"
                                placeholder='Enter your name'
                                className='w-full border border-gray-300 rounded-sm px-4 py-2'
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className='text-xs text-red-500'>{errors.name.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className='text-sm font-medium'>Email <span className='text-red-500'>*</span></label>
                            <input
                                type="email"
                                id="email"
                                placeholder='Enter your email'
                                className='w-full border border-gray-300 rounded-sm px-4 py-2'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                            />
                            {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="phone" className='text-sm font-medium'>Phone <span className='text-red-500'>*</span></label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder='Enter your phone'
                                className='w-full border border-gray-300 rounded-sm px-4 py-2'
                                {...register('phone', { required: 'Phone is required' })}
                            />
                            {errors.phone && <p className='text-xs text-red-500'>{errors.phone.message}</p>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="message" className='text-sm font-medium'>Message <span className='text-red-500'>*</span></label>
                            <textarea
                                id="message"
                                placeholder='Enter your message'
                                className='w-full border border-gray-300 rounded-sm px-4 py-2'
                                rows={4}
                                {...register('message', { required: 'Message is required' })}
                            />
                            {errors.message && <p className='text-xs text-red-500'>{errors.message.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className='w-full bg-primary text-white py-3 px-4 rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContactPage;