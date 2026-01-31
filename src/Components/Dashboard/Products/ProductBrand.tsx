/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';

const ProductBrand = ({
    selectedBrand,
    setSelectedBrand,
    defaultSelectedBrandId = '',
}: {
    selectedBrand: string;
    setSelectedBrand: (brand: string) => void;
    defaultSelectedBrandId?: string;
}) => {
    const [newBrand, setNewBrand] = useState<boolean>(false);
    const hasSyncedDefaultRef = useRef(false);

    // Sync selected brand when product loads (edit mode)
    useEffect(() => {
        if (!defaultSelectedBrandId || hasSyncedDefaultRef.current) return;
        hasSyncedDefaultRef.current = true;
        queueMicrotask(() => setSelectedBrand(defaultSelectedBrandId));
    }, [defaultSelectedBrandId, setSelectedBrand]);

    const { data: brands, isLoading, refetch } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const response = await fetch('/api/product/brand');
            const data = await response.json();
            return data;
        }
    });




    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('brand') as HTMLInputElement;
        try {
            const response = await fetch('/api/product/brand', {
                method: 'POST',
                body: JSON.stringify({ name: input?.value ?? '' }),
            });
            const data = await response.json();
            if (data?.success) {
                refetch();
                setNewBrand(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data?.message,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
            <div className='text-base border-b border-b-black/30 pb-2'>
                Product Brand
            </div>
            <div className='mt-1'>
                <div className='flex flex-col gap-2 border border-black/30 rounded-sm p-2'>
                    <span className='text-xs cursor-pointer'>All Brands</span>
                    {
                        !isLoading && brands?.data?.map((brand: any, index: number) => (
                            <label key={brand?.id ?? index} htmlFor={brand?.id} className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    id={brand?.id}
                                    type='radio'
                                    name='productBrand'
                                    className='w-3 h-3'
                                    title={brand?.name}
                                    value={brand?.id}
                                    checked={selectedBrand === brand?.id}
                                    onChange={() => setSelectedBrand(brand?.id ?? '')}
                                />
                                <span className='text-xs'>{brand?.name}</span>
                            </label>
                        ))
                    }
                </div>
            </div>
            <div className='text-primary cursor-pointer text-xs' onClick={() => setNewBrand(!newBrand)}>
                + Add new brand
            </div>
            {
                newBrand && (
                    <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                        <input name='brand' type='text' placeholder='Brand name' className='border border-black/30 rounded-sm p-2' title='Brand name' />
                        <button type='submit' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'>Add new brand</button>
                    </form>
                )
            }
        </div>
    )
}

export default ProductBrand