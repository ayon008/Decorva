/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Link, Box, ShieldCheck, Tag, Settings, Truck } from 'lucide-react'
import React from 'react'
import General from './General'
import Inventory from './Inventory'
import Shipping from './Shipping'
import LinkedProducts from './LinkedProducts'
import Attributes from './Attributes'
import Advanced from './Advanced'
import { useState, useEffect } from 'react'

const SimpleProductTable = ({ setSampleProductData }: { setSampleProductData: (data: any) => void }) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [generalData, setGeneralDataState] = useState<any>(null);
    const [inventoryData, setInventoryDataState] = useState<any>(null);
    const [shippingData, setShippingDataState] = useState<any>(null);
    const [linkedProductsData, setLinkedProductsDataState] = useState<any>(null);
    const [attributesData, setAttributesDataState] = useState<any>({});
    const [advancedData, setAdvancedDataState] = useState<any>(null);

    const setGeneralData = (data: any) => {
        setGeneralDataState(data);
        console.log('generalData:', data);
    };
    const setInventoryData = (data: any) => {
        setInventoryDataState(data);
        console.log('inventoryData:', data);
    };
    const setShippingData = (data: any) => {
        setShippingDataState(data);
        console.log('shippingData:', data);
    };
    const setLinkedProductsData = (data: any) => {
        setLinkedProductsDataState(data);
        console.log('linkedProductsData:', data);
    };
    const setAttributesData = (data: any) => {
        setAttributesDataState(data);
        console.log('attributesData:', data);
    };
    const setAdvancedData = (data: any) => {
        setAdvancedDataState(data);
        console.log('advancedData:', data);
    };

    useEffect(() => {
        setSampleProductData({
            general: generalData,
            inventory: inventoryData,
            shipping: shippingData,
            linkedProducts: linkedProductsData,
            attributes: attributesData,
            advanced: advancedData,
        });
    }, [generalData, inventoryData, shippingData, linkedProductsData, attributesData, advancedData, setSampleProductData]);

    return (
        <>
            <div className='w-[30%] border-r border-black/30 bg-[#FAFAFA]'>
                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/30 cursor-pointer ${activeTab === 0 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(0)}>
                    <Settings className='w-3 h-3' />
                    <span>General</span>
                </div>
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
                <div className={`flex items-center pl-2 py-2 gap-1 cursor-pointer ${activeTab === 5 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(5)}>
                    <ShieldCheck className='w-3 h-3' />
                    <span>Advanced</span>
                </div>
            </div>
            <div className='w-[70%] pl-2'>
                {
                    activeTab === 0 && <>
                        <General setGeneralData={setGeneralData} />
                    </>
                }
                {
                    activeTab === 1 && <>
                        <Inventory setInventoryData={setInventoryData} />
                    </>
                }
                {
                    activeTab === 2 && <>
                        <Shipping setShippingData={setShippingData} />
                    </>
                }
                {
                    activeTab === 3 && <>
                        <LinkedProducts setLinkedProductsData={setLinkedProductsData} />
                    </>
                }
                {
                    activeTab === 4 && <>
                        <Attributes setAttributesData={setAttributesData} />
                    </>
                }
                {
                    activeTab === 5 && <>
                        <Advanced setAdvancedData={setAdvancedData} />
                    </>
                }
            </div>
        </>
    )
}

export default SimpleProductTable