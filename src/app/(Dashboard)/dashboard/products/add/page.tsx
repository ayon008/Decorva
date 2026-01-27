'use client'
import General from '@/Components/Dashboard/Products/General';
import Inventory from '@/Components/Dashboard/Products/Inventory';
import LinkedProducts from '@/Components/Dashboard/Products/LinkedProducts';
import Shipping from '@/Components/Dashboard/Products/Shipping';
import { Box, Link, Settings, ShieldCheck, Tag, Truck } from 'lucide-react';
import React, { useState } from 'react'

const AddProductPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    return (
        <section className='w-full flex items-start justify-between gap-10'>
            <aside className='w-3/4 flex flex-col gap-4'>
                <h2 className='text-2xl'>Add new product</h2>
                <input type="text" placeholder='Product name' className='w-full p-2 border border-black/50 rounded-sm' />
                <div className='border border-black/50'>
                    <div className='flex items-center border-b border-black/50 gap-2 py-2 px-3'>
                        <h3>Product Data -</h3>
                        <select
                            className="border border-black/50 rounded-sm text-base py-1"
                            title="Product Data"
                        >
                            <option value="simple">Simple Product</option>
                            <option value="variable">Variable Product</option>
                            <option value="grouped">Grouped Product</option>
                            <option value="external">External Product</option>
                            <option value="downloadable">Downloadable Product</option>
                        </select>
                    </div>
                    <div className='flex items-stretch justify-between'>
                        <div className='w-[30%] border-r border-black/50 bg-[#FAFAFA]'>
                            <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/50 cursor-pointer ${activeTab === 0 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(0)}>
                                <Settings className='w-3 h-3' />
                                <span>General</span>
                            </div>
                            <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/50 cursor-pointer ${activeTab === 1 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(1)}>
                                <Box className='w-3 h-3' />
                                <span>Inventory</span>
                            </div>
                            <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/50 cursor-pointer ${activeTab === 2 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(2)}>
                                <Truck className='w-3 h-3' />
                                <span>Shipping</span>
                            </div>
                            <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/50 cursor-pointer ${activeTab === 3 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(3)}>
                                <Link className='w-3 h-3' />
                                <span>Linked Products</span>
                            </div>
                            <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/50 cursor-pointer ${activeTab === 4 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(4)}>
                                <Tag className='w-3 h-3' />
                                <span>Attributes</span>
                            </div>
                            <div className={`flex items-center pl-2 py-2 gap-1 cursor-pointer ${activeTab === 5 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(5)}>
                                <ShieldCheck className='w-3 h-3' />
                                <span>Advanced</span>
                            </div>
                        </div>
                        <div className='w-[70%] pl-2'>
                            {
                                activeTab === 0 && <>
                                    <General />
                                </>
                            }
                            {
                                activeTab === 1 && <>
                                    <Inventory />
                                </>
                            }
                            {
                                activeTab === 2 && <>
                                    <Shipping />
                                </>
                            }
                            {
                                activeTab === 3 && <>
                                    <LinkedProducts />
                                </>
                            }
                        </div>
                    </div>
                </div>
            </aside>
            <aside className='w-1/4'></aside>
        </section>
    )
}

export default AddProductPage;