"use client";
import { Pen } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import Swal from "sweetalert2";

type FormValues = {
    firstName: string;
    lastName: string;
};

const FirstForm = ({ data: user }: { data: User }) => {
    const [show, setShow] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    // Mettre à jour les valeurs du formulaire quand user change
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            });
        }
    }, [user, reset]);


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
                    firstName: data.firstName || undefined,
                    lastName: data.lastName || undefined,
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 global-b-bottom">
                <h3 className="text-lg leading-[100%]">Full name</h3>
                <div
                    onClick={() => setShow(!show)}
                    className="flex items-center gap-2 text-sm leading-[100%] cursor-pointer"
                >
                    <Pen className="w-4 h-4 cursor-pointer" />
                    Edit
                </div>
            </div>

            <div className={`mt-1 grid grid-cols-2 gap-4 ${!show ? 'opacity-50' : ''}`}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                        First name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="Enter first name"
                        className={`w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold opacity-100`}
                        disabled={!show}
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                        Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Enter last name"
                        className={`w-full p-3 rounded-sm border border-black/70 placeholder:text-base text-base font-bold opacity-100`}
                        disabled={!show}
                        {...register("lastName", { required: true })}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
            </div>

            {show && (
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 px-4 rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
                >
                    Save Changes
                </button>
            )}
        </form>
    );
};

export default FirstForm;
