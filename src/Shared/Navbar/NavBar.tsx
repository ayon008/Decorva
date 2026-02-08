"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SideCart from '../Cart/SiteCart';
import { useQuery } from '@tanstack/react-query';
import useCart from '../Hooks/useCart';
import useWishlist from '../Hooks/useWishlist';
import PopUp from '../PopUp/PopUp';

const NavBar = () => {
    const pathname = usePathname();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleCategoriesOpen = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    }

    const { cartOpen, setCartOpen, itemsCount: count } = useCart();
    const { wishlistCount } = useWishlist();


    useGSAP(() => {
        if (!categoriesRef.current) return;
        gsap.to(categoriesRef.current, {
            clipPath: isCategoriesOpen ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 0.5,
            ease: "power2.inOut",
        })
    }, [isCategoriesOpen])


    const isClosingRef = useRef(false);
    const handleMenuClose = () => {
        if (!menuRef.current || isClosingRef.current) return;
        isClosingRef.current = true;
        gsap.to(menuRef.current, {
            xPercent: -100,
            duration: 0.2,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
                isClosingRef.current = false;
                setIsMenuOpen(false);
            },
        });
    };

    useGSAP(() => {
        if (!menuRef.current) return;
        if (isMenuOpen) {
            gsap.fromTo(menuRef.current,
                { xPercent: -100 },
                { xPercent: 0, duration: 0.6, ease: "power3.out", overwrite: true }
            );
        }
    }, [isMenuOpen])


    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/category');
            const data = await response.json();
            return data.categories;
        }
    })

    const categories = data?.filter((category: { name: string }) => category?.name !== 'Uncategorized');


    useEffect(() => {
        setTimeout(() => {
            setIsCategoriesOpen(false)
            setIsMenuOpen(false)
        }, 100)
    }, [pathname])


    return (
        <>
            <nav className='bg-white'>
                <div className='layout border-b border-b-[#E1E1E1]'>
                    <p className='text-xs leading-[24px] py-3 global-padding'>Free Delivery: Take advantage of our time to save event</p>
                </div>
                <div className='border-b border-b-[#E1E1E1]'>
                    <div className='global-padding layout flex items-center justify-between h-full md:gap-10 gap-5'>
                        <h2 className='global-h2 flex items-center md:justify-start justify-center gap-3'>
                            <Menu className='cursor-pointer md:hidden' onClick={() => isMenuOpen ? handleMenuClose() : setIsMenuOpen(true)} />
                            <Link href={"/"}>Decorva</Link>
                        </h2>
                        <div className='relative flex-1 max-w-[500px] md:block hidden'>
                            <input type="text" placeholder='Search' className='w-full border border-[#E1E1E1] rounded-full px-4 py-2 outline-[#E1E1E1]' />
                            <Search className='cursor-pointer absolute right-4 top-1/2 -translate-y-1/2' type='button' />
                        </div>
                        <div className='flex items-center md:gap-6 gap-4 md:border-r-[#E1E1E1] md:border-l-[#E1E1E1] md:border-l md:border-r md:p-10 p-5 self-stretch'>
                            <Link href={'/login'}><User className='cursor-pointer' /></Link>
                            <Link href="/wishlist" className="relative w-fit h-fit">
                                <Heart className="cursor-pointer" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-[10px] bg-primary flex items-center justify-center text-white text-[10px] py-1 px-2 rounded-full min-w-[18px]">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
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
            <div className='md:sticky md:top-0 relative z-[100] bg-white border-b border-b-[#E1E1E1] w-full'>
                <div className='global-padding layout flex items-stretch justify-between flex-wrap md:py-0 py-5'>
                    <div className='md:w-1/4 w-full relative flex items-center cursor-pointer md:bg-white bg-primary' onClick={handleCategoriesOpen}>
                        <div className='flex items-center md:justify-start md:p-0 p-3 justify-between gap-x-10 flex-1'>
                            <svg className='w-8 h-8 text-white md:text-[#333]' width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <line x1="40" y1="60" x2="160" y2="60" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                                <line x1="40" y1="90" x2="120" y2="90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                                <line x1="40" y1="120" x2="160" y2="120" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                                <line x1="40" y1="150" x2="120" y2="150" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                            </svg>
                            <h2 className='md:text-[13px] text-sm font-medium leading-[26px] uppercase cursor-pointer md:text-black text-white'>Categories</h2>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} ref={categoriesRef} className='absolute top-full w-full bg-white shadow-lg border border-[#E1E1E1] overflow-hidden md:p-0 p-3' style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}>
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
                    <div className='flex-1 py-5 border-l border-l-[#E1E1E1] md:flex items-center justify-between gap-6 hidden'>
                        <ul className='flex items-center pl-6 gap-x-8 gap-y-4 w-[80%] flex-wrap'>
                            <li>
                                <Link href={"/"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Home</Link>
                            </li>
                            <li>
                                <Link href={"/shop"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/shop" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Shop</Link>
                            </li>
                            <li>
                                <Link href={"/shop/indoor-plants"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/shop/indoor-plants" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Indoor Plants</Link>
                            </li>
                            <li>
                                <Link href={"/shop/outdoor-plants"} className={`pb-6 border-b-3 transition-all duration-300 text-sm ${pathname === "/shop/outdoor-plants" ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary"}`}>Outdoor Plants</Link>
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

            <PopUp isOpen={isMenuOpen} fn={handleMenuClose}>
                <div className='w-full h-full flex justify-start'>
                    <div ref={menuRef} className='w-[70%] max-w-[320px] h-full bg-white shadow-xl' onClick={(e) => e.stopPropagation()}>
                        <button type='button' title='Close Menu' onClick={handleMenuClose} className='absolute top-5 right-5 z-10 rounded-full border border-black text-black p-1 cursor-pointer'>
                            <X className='w-4 h-4' />
                        </button>
                        <div className='mt-20 px-2'>
                            <label htmlFor='search' className='text-sm font-medium relative'>
                                <input id='search' type="text" placeholder='Search' className='w-full border border-[#E1E1E1] rounded-full px-4 py-2 outline-black' />
                                <Search className='cursor-pointer absolute right-4 top-1/2 -translate-y-1/2' type='button' />
                            </label>
                            <ul className='space-y-4 mt-4 px-4 text-sm leading-[24px] font-normal'>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/"} className='capitalize'>Home</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/shop"} className='capitalize'>Shop</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/shop/indoor-plants"} className='capitalize'>Indoor Plants</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/shop/outdoor-plants"} className='capitalize'>Outdoor Plants</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/wishlist"} className='capitalize'>Wishlist</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/blog"} className='capitalize'>Blog</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/about"} className='capitalize'>About</Link>
                                </li>
                                <li className='pb-2 border-b border-b-[#E1E1E1]'>
                                    <Link href={"/contact"} className='capitalize'>Contact</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </PopUp>


        </>
    )
}

export default NavBar;




