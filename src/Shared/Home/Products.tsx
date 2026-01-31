"use client"
import React, { useState } from 'react'
import { lora } from '../font/Rubik';
import ProductCard from '../Card/ProductCard';

const Products = () => {

    const [active, setActive] = useState(0);


    return (
        <div className="global-padding layout mt-10">
            <ul className='flex items-center justify-center gap-10'>
                <li className={`uppercase text-sm leading-[24px] border-b-2 font-normal hover:text-primary transition-all duration-300 cursor-pointer ${lora.className} ${active === 0 ? "border-b-primary text-primary" : "text-black border-b-transparent hover:border-b-primary"}`} onClick={() => setActive(0)}>Plant Stands & Movers</li>
                <li className={`uppercase text-sm leading-[24px] border-b-2 font-normal hover:text-primary transition-all duration-300 cursor-pointer ${lora.className} ${active === 1 ? "border-b-primary text-primary" : "text-black border-b-transparent hover:border-b-primary"}`} onClick={() => setActive(1)}>Plant Families</li>
                <li className={`uppercase text-sm leading-[24px] border-b-2 font-normal hover:text-primary transition-all duration-300 cursor-pointer ${lora.className} ${active === 2 ? "border-b-primary text-primary" : "text-black border-b-transparent hover:border-b-primary"}`} onClick={() => setActive(2)}>Outdoor Plant Pots</li>
            </ul>
            <div className='mt-6'>
                {/* <ProductCard /> */}
            </div>
        </div>
    )
}

export default Products;