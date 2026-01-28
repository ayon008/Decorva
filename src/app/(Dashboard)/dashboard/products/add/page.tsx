'use client'
import ProductBrand from '@/Components/Dashboard/Products/ProductBrand';
import ProductCategories from '@/Components/Dashboard/Products/ProductCategories';
import ProductDescription from '@/Components/Dashboard/Products/ProductDescription';
import ProductFeatureImage from '@/Components/Dashboard/Products/ProductFeatureImage';
import ProductGallery from '@/Components/Dashboard/Products/ProductGallery';
import ProductTags from '@/Components/Dashboard/Products/ProductTags';
import SimpleProductTable from '@/Components/Dashboard/Products/SimpleProductTable';
import VariableProductTable from '@/Components/Dashboard/Products/VariableProduct';
import React, { useState } from 'react'

const AddProductPage = () => {

    const [productType, setProductType] = useState<string>('simple');

    console.log(productType);

    return (
        <section className=''>
            <h2 className='text-2xl mb-4'>Add new product</h2>
            <div className='w-full flex items-start justify-between gap-6'>
                <aside className='w-3/4 flex flex-col gap-4'>
                    <input type="text" placeholder='Product name' className='w-full p-2 border border-black/30 rounded-sm' />
                    <ProductDescription heading="Product Description" height="400px" />
                    {/* Table */}
                    <div className='border border-black/30'>
                        <div className='flex items-center border-b border-black/30 gap-2 py-2 px-3'>
                            <h3>Product Data -</h3>
                            <select
                                className="border border-black/30 rounded-sm text-base py-1"
                                title="Product Data"
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                            >
                                <option value="simple">Simple Product</option>
                                <option value="variable">Variable Product</option>
                            </select>
                        </div>
                        <div className='flex items-stretch justify-between'>
                            {
                                productType === 'simple' && (
                                    <SimpleProductTable />
                                )
                            }
                            {
                                productType === 'variable' && (
                                    <VariableProductTable />
                                )
                            }
                        </div>
                    </div>
                    <ProductDescription heading="Product Short Description" height="300px" />
                </aside>
                <aside className='w-1/4 flex flex-col gap-4'>
                    <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
                        <div className='text-base border-b border-b-black/30 pb-2'>
                            Publish
                        </div>
                        <button type='button' className='border border-primary bg-white text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer px-4 py-2 rounded-sm text-xs w-fit mt-1 ml-auto'>
                            Publish
                        </button>
                    </div>
                    <ProductFeatureImage />
                    <ProductGallery />
                    <ProductCategories />
                    <ProductTags />
                    <ProductBrand />
                </aside>
            </div>
        </section>
    )
}

export default AddProductPage;