'use client'
import React, { useRef, useState } from 'react'
import PageTitle from '@/Shared/PageTitle/PageTitle';
import productImage from "@/../public/product7.webp"
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Heart, Star, X } from 'lucide-react';
import Title from '@/Shared/Title/Title';
import Offers from '@/Shared/Home/Offers';
import PopUp from '@/Shared/PopUp/PopUp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const ProductPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isOpen, setOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [default_slide, setDefault_slide] = useState<number>(0);
    const swiperRef = useRef<SwiperType | null>(null);

    const images = [productImage, productImage, productImage, productImage];

    return (
        <div>
            <PageTitle title="Product" subTitle="Home / Product" />
            <div className='lg:my-20 my-10'>
                <section className='flex items-start justify-between gap-7 layout global-padding'>
                    <aside className='lg:w-1/2 w-full grid grid-cols-2 gap-2 overflow-hidden rounded-sm border border-[#E1E1E1]'>
                        {
                            images?.map((img, i) => {
                                return (
                                    <Image onClick={() => { setOpen(true); setDefault_slide(i); setActiveIndex(i) }} key={i} src={img} alt="product" width={570} height={570} className='w-full h-full object-cover aspect-[1] cursor-pointer' />
                                )
                            })
                        }
                    </aside>
                    <aside className='lg:w-1/2 w-full space-y-6'>
                        <h2 className='product-title hover:text-primary transition-colors duration-300 text-black'>
                            commodo augue nisi
                        </h2>
                        <div className='flex items-center gap-1'>
                            <Star className='text-yellow-500 w-4 h-4' />
                            <Star className='text-yellow-500 w-4 h-4' />
                            <Star className='text-yellow-500 w-4 h-4' />
                            <Star className='text-yellow-500 w-4 h-4' />
                            <Star className='text-yellow-500 w-4 h-4' />
                        </div>
                        <div className='flex items-center gap-3'>
                            <span className='text-[23px] font-medium leading-[16px] text-primary'>100د.إ</span>
                            <span className='text-[20px] font-normal leading-[16px] line-through text-black'>120د.إ</span>
                        </div>
                        <p className='pb-6 border-b border-[#E1E1E1] text-base leading-[24px] font-normal text-black'>
                            eget velit. Donec ac tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus
                            eget sagittis vulputate, sapien libero hendrerit est, sed commodo augue nisi non
                            neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor, lorem et
                            placerat vestibulum, metus nisi posuere nisl, in
                        </p>
                        <h3 className='text-lg capitalize font-medium leading-[30px]'>Available Options</h3>
                        <button
                            type='button'
                            className="w-full bg-primary text-white py-3 px-4 rounded-sm hover:bg-primary/80 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
                        >
                            Add To Cart
                        </button>
                        <div className='flex items-center gap-2'>
                            <Heart fill='red' stroke='red' className='w-6 h-6' />
                            <span className='text-lg font-medium leading-[16px] text-black'>Add to Wishlist</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span>Category:</span>
                            <span className='text-lg font-medium leading-[16px] text-black'>Grass</span>
                        </div>
                    </aside>
                </section>
            </div>
            <div className='layout global-padding global-margin'>
                <div className='border border-[#E1E1E1] rounded-sm p-6 global-margin'>
                    <ul className='flex items-center gap-10 text-[20px] leading-[26px] capitalize font-medium text-black border-b border-[#E1E1E1] pb-4'>
                        <li className={`cursor-pointer hover:text-primary transition-all duration-300 ${activeTab === 0 ? "text-primary" : "text-black"}`} onClick={() => setActiveTab(0)}>Description</li>
                        <li className={`cursor-pointer hover:text-primary transition-all duration-300 ${activeTab === 1 ? "text-primary" : "text-black"}`} onClick={() => setActiveTab(1)}>Reviews (0)</li>
                        <li className={`cursor-pointer hover:text-primary transition-all duration-300 ${activeTab === 2 ? "text-primary" : "text-black"}`} onClick={() => setActiveTab(2)}>Specification</li>
                    </ul>
                    {/* content */}
                    {activeTab === 0 && <div>
                        <p className='mt-6 text-sm leading-[24px] font-normal text-black'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum. Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing cursus eu, suscipit id nulla.
                            <br />
                            Pellentesque aliquet, sem eget laoreet ultrices, ipsum metus feugiat sem, quis fermentum turpis eros eget velit. Donec ac tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus eget sagittis vulputate, sapien libero hendrerit est, sed commodo augue nisi non neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor, lorem et placerat vestibulum, metus nisi posuere nisl, in accumsan elit odio quis mi. Cras neque metus, consequat et blandit et, luctus a nunc. Etiam gravida vehicula tellus, in imperdiet ligula euismod eget.
                        </p>
                    </div>}
                    {activeTab === 1 && <div className='mt-6'>
                        Add A review
                    </div>}
                    {activeTab === 2 && <div>
                        <p className='mt-6 text-sm leading-[24px] font-normal text-black'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum. Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing cursus eu, suscipit id nulla.
                            <br />
                            Pellentesque aliquet, sem eget laoreet ultrices, ipsum metus feugiat sem, quis fermentum turpis eros eget velit. Donec ac tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus eget sagittis vulputate, sapien libero hendrerit est, sed commodo augue nisi non neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor, lorem et placerat vestibulum, metus nisi posuere nisl, in accumsan elit odio quis mi. Cras neque metus, consequat et blandit et, luctus a nunc. Etiam gravida vehicula tellus, in imperdiet ligula euismod eget.
                        </p>
                    </div>}
                </div>
                <div>
                    <Title title="Related Products" className="text-center" />
                    <Offers />
                </div>
            </div>




            {/*Product Image Popup */}
            <PopUp isOpen={isOpen}>
                <div className='w-full h-full overflow-hidden bg-white relative flex items-center justify-center'>
                    <div className='absolute top-5 right-5 z-10 rounded-full border border-black text-black p-1 cursor-pointer'>
                        <X className='w-5 h-5' onClick={() => setOpen(!isOpen)} />
                    </div>
                    <div className='w-full h-full'>
                        <div className='w-full h-full mx-auto flex flex-col items-center justify-center relative'>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation={{
                                    nextEl: "#customNext",
                                    prevEl: "#customPrev",
                                }}
                                spaceBetween={10}
                                slidesPerView={1}
                                initialSlide={default_slide}
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                className="mySwiper z-20 lg:w-[80%] w-[90%] h-[80%] relative"
                            >
                                {
                                    images?.map((img, i) => {
                                        return (
                                            <SwiperSlide key={i} className='w-full h-full'>
                                                <div className='w-full h-full relative flex items-center justify-center aspect-video'>
                                                    <Image src={img?.src} className='w-full h-full rounded-[4px] object-contain aspect-[1]' width={649} height={649} alt={'ayon'} />
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                            {/* Pagination */}
                            <div className='relative px-3 py-[10px] w-full z-50 backdrop-blur-[4px] border border-gray-200 rounded-[4px] items-center justify-center bg-white/20 gap-2 md:flex hidden max-w-fit mx-auto'>
                                {
                                    images?.map((singleImage, index) => {
                                        const isActive = activeIndex === index;
                                        return (
                                            <div
                                                onClick={() => swiperRef.current?.slideTo(index)}
                                                key={index}
                                                className={`overflow-hidden rounded-[4px] relative cursor-pointer transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                            >
                                                <Image src={singleImage} width={54} height={54} alt='' className='w-[54px] h-[54px] aspect-[1]' />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {/* Navigation Button */}
                            <button
                                id="customPrev"
                                className="absolute md:top-1/2 md:left-4 md:bottom-auto md:right-auto bottom-5 right-20  md:-translate-y-1/2 z-50 border border-black p-2 rounded-full shadow cursor-pointer"
                                title="Previous"
                            >
                                <ArrowLeft className='w-4 h-4' />
                            </button>
                            <button
                                id="customNext"
                                className="absolute md:top-1/2 md:bottom-auto md:right-4 md:-translate-y-1/2  bottom-5 right-5 z-50 border border-black p-2 rounded-full shadow cursor-pointer"
                                title="Next"
                            >
                                <ArrowRight className='w-4 h-4' />
                            </button>
                            {/* */}
                        </div>
                    </div>
                </div>
            </PopUp>
        </div>
    )
}

export default ProductPage;