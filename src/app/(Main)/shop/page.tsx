
import PageTitle from '@/Shared/PageTitle/PageTitle';
import AllProducts from '@/Shared/Products/AllProducts';
import React from 'react'

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