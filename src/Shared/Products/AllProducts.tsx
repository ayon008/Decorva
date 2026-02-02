"use client"
import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from '../Card/ProductCard'
import ReactRangeSliderInput from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ProductLoader from '@/app/(Main)/Loader/ProductLoader';

const AllProducts = () => {


    const params = useParams();
    const category = params.slug;

    const url = category ? `/api/category/${category}` : '/api/product';



    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);


    const { data: categoryProducts, isLoading } = useQuery({
        queryKey: ['categoryProducts', category],
        queryFn: async () => {
            const response = await fetch(url);
            const data = await response.json();
            return category ? data.category?.products : data.products;
        },
        staleTime: 60 * 60 * 1000, // Cache for 1 hour
    })

    const { minPrice, maxPrice } = useMemo(() => {
        if (!categoryProducts || categoryProducts.length === 0) {
            return { minPrice: 0, maxPrice: 0 };
        }

        const prices = categoryProducts.map((p: { price: number }) => Number(p?.price));
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices)
        };
    }, [categoryProducts]);



    useEffect(() => {
        if (minPrice > 0 || maxPrice > 0) {
            setPriceRange([minPrice, maxPrice]);
        }
    }, [minPrice, maxPrice]);

    const filteredProducts = useMemo(() => {
        if (!categoryProducts) return [];

        const [min, max] = priceRange;
        return categoryProducts.filter((product: { price: number }) => {
            const price = Number(product?.price);
            return price >= min && price <= max;
        });
    }, [categoryProducts, priceRange]);


    const handleChange = (val: [number, number]) => {
        setPriceRange(val);
    }


    // const renderCategories = (categories) => {
    //     const logSelectedCategoryIds = () => {
    //         const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    //         const selectedIds = Array.from(checkedBoxes).map(cb => cb.value)?.length > 0 ? Array.from(checkedBoxes).map(cb => cb.value) : id;
    //         setIds(selectedIds);
    //     };

    //     return (
    //         <ul className="space-y-3">
    //             {categories.map((cat) => (
    //                 <li key={cat.id} className="flex flex-col">
    //                     {/* Checkbox + Label */}
    //                     <label className="flex items-center gap-2 cursor-pointer">
    //                         <input
    //                             type="checkbox"
    //                             className="peer w-3 h-3 cursor-pointer accent-black"
    //                             value={cat.id}
    //                             onChange={logSelectedCategoryIds}
    //                         />
    //                         <span className="text-[#999] font-semibold text-[14px] leading-[16px] uppercase peer-checked:text-[#111111bf]">
    //                             {cat.name}
    //                         </span>
    //                     </label>

    //                     {/* Children */}
    //                     {Array.isArray(cat.children) && cat.children.length > 0 && (
    //                         <div className="ml-6 mt-3">
    //                             {renderCategories(cat.children)}
    //                         </div>
    //                     )}
    //                 </li>
    //             ))}
    //         </ul>
    //     );
    // };

    if (categoryProducts && categoryProducts.length === 0) return <div>No products found</div>

    return (
        <div className='w-full flex items-start justify-between gap-10'>
            <div className='grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-start w-3/4 gap-6'>
                {
                    isLoading ?
                        Array.from({ length: 12 }).map((_, index) => (
                            <ProductLoader key={index} />
                        ))
                        :
                        filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product: { id: string, images: { url: string }[], name: string, price: number, regularPrice: number, salePrice: number, slug: string }) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                }
            </div>
            <div className='sticky top-[80px] w-1/4 flex flex-col gap-10'>
                {
                    categoryProducts && categoryProducts.length > 1 && (
                        <div>
                            <h3 className='filter-heading'>Filter By Price</h3>
                            <ReactRangeSliderInput min={minPrice}
                                max={maxPrice}
                                value={priceRange}
                                onInput={handleChange}
                                className='my-dashed-slider'
                            />
                            <div className='text-[14px] leading-[15px] font-semibold mt-4'>
                                د.إ {priceRange[1].toFixed(2)} — د.إ {priceRange[0].toFixed(2)}
                            </div>
                        </div>
                    )
                }
                <div>
                    <h3 className='filter-heading'>Filter By Category</h3>

                </div>
            </div>
        </div>
    )
}

export default AllProducts