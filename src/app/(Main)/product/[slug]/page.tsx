'use client'
import React, { useRef, useState } from 'react'
import PageTitle from '@/Shared/PageTitle/PageTitle';
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
import ImageMagnifier from '@/Shared/Products/MagnifyImage';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import useCart from '@/Shared/Hooks/useCart';
import Skeleton from '@/Shared/Loader/Skeleton';


const SinglePageLoader = () => {
    return (
        <section className='flex items-start gap-7 layout global-padding'>
            <div className='w-1/2 grid grid-cols-2 gap-2 rounded-sm border border-[#E1E1E1]'>
                <Skeleton className='w-full h-[285px]' />
                <Skeleton className='w-full h-[285px]' />
                <Skeleton className='w-full h-[285px]' />
                <Skeleton className='w-full h-[285px]' />
            </div>
            <div className='w-1/2 flex flex-col gap-6'>
                <Skeleton className='w-[80%] h-[20px]' />
                <Skeleton className='w-[40%] h-[16px]' />
                <Skeleton className='w-[60%] h-[200px]' />
                <Skeleton className='w-[30%] h-[30px]' />
                <Skeleton className='w-full h-[48px]' />
                <Skeleton className='w-[30%] h-[30px]' />
                <Skeleton className='w-[30%] h-[30px]' />
            </div>
        </section>
    )
}

const ProductPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isOpen, setOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [default_slide, setDefault_slide] = useState<number>(0);
    const swiperRef = useRef<SwiperType | null>(null);
    const { handleAddToCart } = useCart();
    const params = useParams();
    const slug = params.slug;

    const { data: product = null, isLoading } = useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const response = await fetch(`/api/product?slug=${slug}`);
            const data = await response.json();
            return data.product;
        },
    });
    const { name, descriptionHtml, shortDescriptionHtml, regularPrice, salePrice, images, categories, productBrand, tags, enabledReviews } = product || {};

    return (
        <div>
            <PageTitle title="Product" subTitle="Home / Product" />
            <div className='lg:my-20 my-10'>
                {
                    isLoading ? <SinglePageLoader /> : (
                        <section className='flex items-start justify-between gap-7 layout global-padding'>
                            <aside className='lg:w-1/2 w-full grid grid-cols-2 gap-2 overflow-hidden rounded-sm border border-[#E1E1E1]'>
                                {
                                    images && images.length > 0 && images.slice(0, 4).map((img: { id: string, url: string }, i: number) => {
                                        return (
                                            <Image onClick={() => { setOpen(true); setDefault_slide(i); setActiveIndex(i) }} key={i} src={img?.url} alt="product" width={285} height={285} className='w-full h-full object-cover aspect-[1] cursor-pointer' />
                                        )
                                    })
                                }
                            </aside>
                            <aside className='lg:w-1/2 w-full space-y-6'>
                                <h2 className='product-title hover:text-primary transition-colors duration-300 text-black'>
                                    {name}
                                </h2>
                                <div className='flex items-center gap-1'>
                                    <Star className='text-yellow-500 w-4 h-4' />
                                    <Star className='text-yellow-500 w-4 h-4' />
                                    <Star className='text-yellow-500 w-4 h-4' />
                                    <Star className='text-yellow-500 w-4 h-4' />
                                    <Star className='text-yellow-500 w-4 h-4' />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='text-[23px] font-medium leading-[16px] text-primary'>{salePrice}د.إ</span>
                                    <span className='text-[20px] font-normal leading-[16px] line-through text-black'>{regularPrice}د.إ</span>
                                </div>
                                <p className='pb-6 border-b border-[#E1E1E1] text-base leading-[24px] font-normal text-black' dangerouslySetInnerHTML={{ __html: shortDescriptionHtml }} />
                                <h3 className='text-lg capitalize font-medium leading-[30px]'>Available Options</h3>
                                <button
                                    type='button'
                                    className="w-full bg-primary text-white py-3 px-4 rounded-sm hover:bg-primary/80 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
                                    onClick={() => handleAddToCart({ id: product?.id, quantity: 1, price: product?.salePrice, image: product?.images[0]?.url || '', name: product?.name || '' })}
                                >
                                    Add To Cart
                                </button>
                                <div className='flex items-center gap-2'>
                                    <Heart fill='red' stroke='red' className='w-6 h-6' />
                                    <span className='text-lg font-medium leading-[16px] text-black'>Add to Wishlist</span>
                                </div>
                                {
                                    categories?.length > 0 && (
                                        <div className='flex items-center gap-2'>
                                            <span>Category:</span>
                                            <span className='text-lg font-medium leading-[16px] text-black'>
                                                {
                                                    categories?.map((category: { id: string, name: string }) => (
                                                        category?.name
                                                    )).join(', ')
                                                }
                                            </span>
                                        </div>
                                    )
                                }
                                {
                                    productBrand?.name && (
                                        <div className='flex items-center gap-2'>
                                            <span>Brand:</span>
                                            <span className='text-lg font-medium leading-[16px] text-black'>
                                                {
                                                    productBrand?.name
                                                }
                                            </span>
                                        </div>
                                    )
                                }
                            </aside>
                        </section>
                    )
                }
            </div>
            <div className='layout global-padding global-margin'>
                <div className='border border-[#E1E1E1] rounded-sm p-6 global-margin'>
                    <ul className='flex items-center gap-10 text-[20px] leading-[26px] capitalize font-medium text-black border-b border-[#E1E1E1] pb-4'>
                        <li className={`cursor-pointer hover:text-primary transition-all duration-300 ${activeTab === 0 ? "text-primary" : "text-black"}`} onClick={() => setActiveTab(0)}>Description</li>
                        {
                            enabledReviews && (
                                <li className={`cursor-pointer hover:text-primary transition-all duration-300 ${activeTab === 1 ? "text-primary" : "text-black"}`} onClick={() => setActiveTab(1)}>Reviews (0)</li>
                            )
                        }
                    </ul>
                    {/* content */}
                    {activeTab === 0 && <div>
                        <p className='mt-6 text-sm leading-[24px] font-normal text-black' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                    </div>}
                    {activeTab === 1 && <div className='mt-6'>
                        Add A review
                    </div>}
                </div>
                <div>
                    <Title title="Related Products" className="text-center" />
                    <Offers />
                </div>
            </div>




            {/*Product Image Popup */}
            <PopUp fn={setOpen} isOpen={isOpen}>
                <div className='w-full h-full overflow-hidden bg-white relative flex items-center justify-center'>
                    <div className='absolute top-5 right-5 z-10 rounded-full border border-black text-black p-1 cursor-pointer'>
                        <X className='w-5 h-5' onClick={() => setOpen(!isOpen)} />
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className='w-full h-full'>
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
                                    images?.map((img: { id: string, url: string }, i: number) => {
                                        return (
                                            <SwiperSlide key={i} className='w-full h-full'>
                                                <div className='w-full h-full relative flex items-center justify-center aspect-video'>
                                                    <ImageMagnifier
                                                        src={img?.url}
                                                        alt={'ayon'}
                                                        className='w-full h-full rounded-[4px] object-contain aspect-[1]'
                                                        width={450}
                                                        height={450}
                                                        zoomLevel={1.5}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                            {/* Pagination */}
                            <div className='relative px-3 py-[10px] w-full z-50 backdrop-blur-[4px] border border-gray-200 rounded-[4px] items-center justify-center bg-white/20 gap-2 md:flex hidden max-w-fit mx-auto'>
                                {
                                    images?.map((singleImage: { id: string, url: string }, index: number) => {
                                        const isActive = activeIndex === index;
                                        return (
                                            <div
                                                onClick={() => swiperRef.current?.slideTo(index)}
                                                key={index}
                                                className={`overflow-hidden rounded-[4px] relative cursor-pointer transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                            >
                                                <Image src={singleImage?.url} width={54} height={54} alt={singleImage?.id} className='w-[54px] h-[54px] aspect-[1]' />
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