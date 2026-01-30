/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Link, Box, ShieldCheck, Tag, Truck, List } from 'lucide-react'
import React from 'react'
import Inventory from './Inventory'
import Shipping from './Shipping'
import LinkedProducts from './LinkedProducts'
import Attributes from './Attributes'
import Advanced from './Advanced'
import { useState } from 'react'
import Variations from './Variations'

const VariableProductTable = ({ setSampleProductData }: { setSampleProductData: (data: any) => void }) => {
    const [activeTab, setActiveTab] = useState<number>(1)
    const [inventoryData, setInventoryDataState] = useState<any>(null);
    const [shippingData, setShippingDataState] = useState<any>(null);
    const [linkedProductsData, setLinkedProductsDataState] = useState<any>(null);
    const [attributesData, setAttributesDataState] = useState<any>({});
    const [advancedData, setAdvancedDataState] = useState<any>(null);


    return (
        <>
            <div className='w-[30%] border-r border-black/30 bg-[#FAFAFA]'>
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
                    activeTab === 1 && <>
                        <Inventory setInventoryData={setInventoryDataState} />
                    </>
                }
                {
                    activeTab === 2 && <>
                        <Shipping setShippingData={setShippingDataState} />
                    </>
                }
                {
                    activeTab === 3 && <>
                        <LinkedProducts setLinkedProductsData={setLinkedProductsDataState} />
                    </>
                }
                {
                    activeTab === 4 && <>
                        <Attributes setAttributesData={setAttributesDataState} />
                    </>
                }
                {
                    activeTab === 5 && <>
                        <Variations />
                    </>
                }
                {
                    activeTab === 6 && <>
                        <Advanced setAdvancedData={setAdvancedDataState} />
                    </>
                }
            </div>
        </>
    )
}

export default VariableProductTable