import type { Metadata } from "next";
import PageTitle from '@/Shared/PageTitle/PageTitle';
import AllProducts from '@/Shared/Products/AllProducts';
import React from 'react'

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our home decor and furniture catalog. Explore categories and find the perfect pieces for your interior.",
};

const ShopPage = () => {
    return (
        <div>
            <PageTitle title="Shop" subTitle="Home / Shop" />
            <div className='global-padding layout lg:my-20 my-10 flex items-start justify-between gap-10'>
                <AllProducts />
            </div>
        </div>
    )
}

export default ShopPage;