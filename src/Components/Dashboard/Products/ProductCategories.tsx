/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';

const ProductCategories = ({
    selectedCategory,
    setSelectedCategory,
    defaultSelectedCategoryIds = [],
}: {
    selectedCategory: string[];
    setSelectedCategory: (category: string[]) => void;
    defaultSelectedCategoryIds?: string[];
}) => {
    const [newCategory, setNewCategory] = useState<boolean>(false);
    const hasSyncedDefaultRef = useRef(false);

    // Sync selected categories when product loads (edit mode)
    useEffect(() => {
        if (!defaultSelectedCategoryIds?.length || hasSyncedDefaultRef.current) return;
        hasSyncedDefaultRef.current = true;
        queueMicrotask(() => setSelectedCategory(defaultSelectedCategoryIds));
    }, [defaultSelectedCategoryIds, setSelectedCategory]);

    const { data: categories, isLoading, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/product/categories');
            const data = await response.json();
            return data.data;
        }
    })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('category') as HTMLInputElement;
        const parent = e.currentTarget.elements.namedItem('category-parent') as HTMLSelectElement;

        try {
            const response = await fetch('/api/product/categories', {
                method: 'POST',
                body: JSON.stringify({ name: input?.value, parentId: parent?.value }),
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message,
                });
                setNewCategory(false);
                refetch();
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message,
                });
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }

    const onChange = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const ids = formData.getAll('category') as string[];
        setSelectedCategory(ids);
    }


    return (
        <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
            <div className='text-base border-b border-b-black/30 pb-2'>
                Product Categories
            </div>
            <div className='mt-1'>
                <form onChange={(event) => onChange(event)} className='flex flex-col gap-2 border border-black/30 rounded-sm p-2'>
                    <span className='text-xs cursor-pointer'>All Categories</span>
                    {
                        !isLoading && categories?.map((category: any) => (
                            <label key={category.id} htmlFor={category.id} className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    name='category'
                                    value={category.id}
                                    id={category.id}
                                    type='checkbox'
                                    className='w-3 h-3'
                                    title={category.name}
                                    checked={selectedCategory.includes(category.id)}
                                />
                                <span className='text-xs'>{category.name}</span>
                            </label>
                        ))
                    }
                </form>
            </div>
            <div className='text-primary cursor-pointer text-xs' onClick={() => setNewCategory(!newCategory)}>
                + Add new category
            </div>
            {
                newCategory && (
                    <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                        <input name='category' type='text' placeholder='Category name' className='border border-black/30 rounded-sm p-2' title='Category name' />
                        <select name='category-parent' id='category-parent' className='border border-black/30 rounded-sm p-2' title='Category parent'>
                            <option disabled selected value=''>Select a parent category</option>
                            {
                                !isLoading && categories?.map((category: any, index: number) => (
                                    <option key={index} value={category.id}>{category.name}</option>
                                ))
                            }
                        </select>
                        <button type='submit' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'>Add new category</button>
                    </form>
                )
            }
        </div>
    )
}

export default ProductCategories