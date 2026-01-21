"use client"
import React from 'react'
import ProductCard from '../Card/ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Offers = () => {
    return (
        <div className='mt-10'>
            <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={4}
                navigation={true}
                loop={true}
                aria-live="polite"
                aria-label="Product Carousel"
                className=" h-full w-full product-carousel"
            >
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
                <SwiperSlide>
                    <ProductCard />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Offers