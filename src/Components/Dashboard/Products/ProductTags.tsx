'use client'
import { Trash } from 'lucide-react';
import React, { useState } from 'react'

const ProductTags = ({ tags, setTags }: { tags: string[], setTags: (tags: string[]) => void }) => {

    const [tagInput, setTagInput] = useState<string>('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('tags') as HTMLInputElement;
        const tags = input?.value?.split(',') ?? [];
        setTags(tags);
        setTagInput(input?.value ?? '');
    }


    return (
        <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
            <div className='text-base border-b border-b-black/30 pb-2'>
                Product Tags
            </div>
            <form onKeyDown={(e) => e.key === 'Enter' && onSubmit(e)} onSubmit={onSubmit} className='mt-1 flex items-stretch gap-2'>
                <input name='tags' type='text' placeholder='Separate tags with commas' className='border border-black/30 rounded-sm p-2 flex-1 max-w-[70%] placeholder:text-[10px]' title='Add new tag' />
                <button type='submit' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 text-xs'>Add</button>
            </form>
            {
                tagInput &&
                <div onClick={() => {
                    setTagInput('');
                    setTags(tags.filter((tag) => tag !== tagInput));
                }} className='flex items-center gap-6 mt-4'>
                    <span className='text-xs tracking-widest'>{tagInput}</span>
                    <Trash className='w-3 h-3 cursor-pointer' />
                </div>
            }
        </div>
    )
}

export default ProductTags