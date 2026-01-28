'use client'
import { Link, Box, ShieldCheck, Tag, Settings, Truck, List } from 'lucide-react'
import React from 'react'
import General from './General'
import Inventory from './Inventory'
import Shipping from './Shipping'
import LinkedProducts from './LinkedProducts'
import Attributes from './Attributes'
import Advanced from './Advanced'
import { useState } from 'react'

const VariableProductTable = () => {
    const [activeTab, setActiveTab] = useState<number>(1)
    return (
        <>
            <div className='w-[30%] border-r border-black/30 bg-[#FAFAFA]'>
                {/* <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 0 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(0)}>
                    <Settings className='w-3 h-3' />
                    <span>General</span>
                </div> */}
                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 1 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(1)}>
                    <Box className='w-3 h-3' />
                    <span>Inventory</span>
                </div>
                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 2 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(2)}>
                    <Truck className='w-3 h-3' />
                    <span>Shipping</span>
                </div>
                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 3 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(3)}>
                    <Link className='w-3 h-3' />
                    <span>Linked Products</span>
                </div>
                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 4 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(4)}>
                    <Tag className='w-3 h-3' />
                    <span>Attributes</span>
                </div>
                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 5 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(5)}>
                    <List className='w-3 h-3' />
                    <span>Variations</span>
                </div>
                <div className={`flex items-center pl-2 py-2 gap-1 cursor-pointer ${activeTab === 6 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(6)}>
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
                {
                    activeTab === 4 && <>
                        <Attributes />
                    </>
                }
                {
                    activeTab === 6 && <>
                        <Advanced />
                    </>
                }
            </div>
        </>
    )
}

export default VariableProductTable