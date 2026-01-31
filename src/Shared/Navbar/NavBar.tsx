"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SideCart from '../Cart/SiteCart';
import { useQuery } from '@tanstack/react-query';
import useCart from '../Hooks/useCart';

const NavBar = () => {
    const pathname = usePathname();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
    const categoriesRef = useRef<HTMLDivElement>(null);

    const handleCategoriesOpen = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    }

    const { cartOpen, setCartOpen, itemsCount: count } = useCart();


    useGSAP(() => {
        if (!categoriesRef.current) return;
        gsap.to(categoriesRef.current, {
            clipPath: isCategoriesOpen ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 0.5,
            ease: "power2.inOut",
        })
    }, [isCategoriesOpen])


    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/category');
            const data = await response.json();
            return data.categories;
        }
    })


    return (
        <>
            <nav className='bg-white'>
                <div className='layout border-b border-b-[#E1E1E1]'>
                    <p className='text-xs leading-[24px] py-3 global-padding'>Free Delivery: Take advantage of our time to save event</p>
                </div>
                <div className='border-b border-b-[#E1E1E1]'>
                    <div className='global-padding layout flex items-center justify-between h-full gap-10'>
                        <h2 className='global-h2'>
                            <Link href={"/"}>Decorva</Link>
                        </h2>
                        <div className='relative flex-1 max-w-[500px]'>
                            <input type="text" placeholder='Search' className='w-full border border-[#E1E1E1] rounded-full px-4 py-2 outline-[#E1E1E1]' />
                            <Search className='cursor-pointer absolute right-4 top-1/2 -translate-y-1/2' type='button' />
                        </div>
                        <div className='flex items-center gap-6 border-r-[#E1E1E1] border-l-[#E1E1E1] border-l border-r p-10 self-stretch'>
                            <Link href={'/login'}><User className='cursor-pointer' /></Link>
                            <Heart className='cursor-pointer' />
                            <div className='w-fit h-fit relative cursor-pointer' onClick={() => setCartOpen(!cartOpen)}>
                                <ShoppingBag />
                                <div className='bg-primary flex items-center justify-center text-white text-[10px] py-1 px-2 rounded-full absolute -top-2 -right-[10px]'>
                                    {count}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className='sticky top-0 z-[100] bg-white border-b border-b-[#E1E1E1] w-full'>
                <div className='global-padding layout flex items-stretch justify-between flex-wrap'>
                    <div className='w-1/4 relative flex items-center cursor-pointer' onClick={handleCategoriesOpen}>
                        <div className='flex items-center gap-x-10 flex-1'>
                            <svg className='w-8 h-8' width="200" height="200" viewBox="0 0 200 200" xmlns="http:www.w3.org/2000/svg">
                                <line x1="40" y1="60" x2="160" y2="60" stroke="#333" strokeWidth="10" strokeLinecap="round" />
                                <line x1="40" y1="90" x2="120" y2="90" stroke="#333" strokeWidth="10" strokeLinecap="round" />
                                <line x1="40" y1="120" x2="160" y2="120" stroke="#333" strokeWidth="10" strokeLinecap="round" />
                                <line x1="40" y1="150" x2="120" y2="150" stroke="#333" strokeWidth="10" strokeLinecap="round" />
                            </svg>
                            <h2 className='text-[13px] font-medium leading-[26px] uppercase cursor-pointer'>Categories</h2>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} ref={categoriesRef} className='absolute top-full w-full bg-white shadow-lg border border-[#E1E1E1] overflow-hidden' style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}>
                            <ul className='p-6 space-y-4 text-sm leading-[24px] font-normal'>
                                {
                                    !isLoading && categories?.length > 0 && categories?.map((category: { id: string, name: string, slug: string }) => (
                                        <li key={category.id}>
                                            <Link onClick={() => setIsCategoriesOpen(false)} className='capitalize' href={`/shop/${category?.slug}`}>
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='flex-1 py-5 border-l border-l-[#E1E1E1] flex items-center justify-between gap-6'>
                        <ul className='flex items-center pl-6 gap-x-8 gap-y-4 w-[80%] flex-wrap'>
                            <li>
                                <Link href={"/"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Home</Link>
                            </li>
                            <li>
                                <Link href={"/shop"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/shop" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Shop</Link>
                            </li>
                            <li>
                                <Link href={"/indoor-plants"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/indoor-plants" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Indoor Plants</Link>
                            </li>
                            <li>
                                <Link href={"/outdoor-plants"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/outdoor-plants" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Outdoor Plants</Link>
                            </li>
                            <li>
                                <Link href={"/blog"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/blog" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Blog</Link>
                            </li>
                            <li>
                                <Link href={"/about"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/about" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>About</Link>
                            </li>
                            <li>
                                <Link href={"/contact"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/contact" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Contact</Link>
                            </li>
                        </ul>
                        <a
                            href="tel:+21620123456"
                            className={`text-[12px] leading-[14px] font-medium`}
                        >
                            Call Support: <span className='text-primary'>+216 20 123 456</span>
                        </a>
                    </div>
                </div>
            </div>


            <SideCart isOpen={cartOpen} onClose={() => setCartOpen(!cartOpen)} />
        </>
    )
}

export default NavBar;




