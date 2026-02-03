"use client"
import React, { useState } from 'react'
import { lora } from '../font/Rubik';
import ProductCard from '../Card/ProductCard';
import { useQuery } from '@tanstack/react-query';
import ProductLoader from '@/app/(Main)/Loader/ProductLoader';

const Products = () => {

    const [active, setActive] = useState(0);

    const category = active === 0 ? 'plant-stands-&-movers' : active === 1 ? 'plant-families' : 'outdoor-plant-pots';

    const { data: categoryProducts = [], isLoading } = useQuery({
        queryKey: ['products', category],
        queryFn: async () => {
            const response = await fetch(`/api/category/${category}`);
            const data = await response.json();
            return data.category?.products;
        }
    })


    return (
        <div className="global-padding layout mt-10">
            <ul className='flex items-center justify-center gap-10'>
                <li className={`uppercase text-sm leading-[24px] border-b-2 font-normal hover:text-primary transition-all duration-300 cursor-pointer ${lora.className} ${active === 0 ? "border-b-primary text-primary" : "text-black border-b-transparent hover:border-b-primary"}`} onClick={() => setActive(0)}>Plant Stands & Movers</li>
                <li className={`uppercase text-sm leading-[24px] border-b-2 font-normal hover:text-primary transition-all duration-300 cursor-pointer ${lora.className} ${active === 1 ? "border-b-primary text-primary" : "text-black border-b-transparent hover:border-b-primary"}`} onClick={() => setActive(1)}>Plant Families</li>
                <li className={`uppercase text-sm leading-[24px] border-b-2 font-normal hover:text-primary transition-all duration-300 cursor-pointer ${lora.className} ${active === 2 ? "border-b-primary text-primary" : "text-black border-b-transparent hover:border-b-primary"}`} onClick={() => setActive(2)}>Outdoor Plant Pots</li>
            </ul>
            <div className='mt-6 grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-start w-full gap-6'>
                {
                    isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <ProductLoader key={index} />
                        ))
                    ) : (
                        categoryProducts && categoryProducts.length > 0 && categoryProducts.slice(0, 8).map((product: { id: string, images: { url: string }[], name: string, price: number, regularPrice: number, salePrice: number, slug: string }) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default Products;