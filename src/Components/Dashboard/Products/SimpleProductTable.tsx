/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Link, Box, ShieldCheck, Tag, Settings, Truck } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'
import General from './General'
import Inventory from './Inventory'
import Shipping from './Shipping'
import LinkedProducts from './LinkedProducts'
import Attributes from './Attributes'
import Advanced from './Advanced'

function buildDefaultsFromProduct(product: any) {
    if (!product) return { general: null, inventory: null, shipping: null, advanced: null }
    const toLocal = (d: string | Date | null | undefined) => {
        if (d == null) return ''
        const date = typeof d === 'string' ? new Date(d) : d
        if (Number.isNaN(date.getTime())) return ''
        return date.toISOString().slice(0, 16)
    }
    return {
        general: {
            regularPrice: product.regularPrice != null ? String(product.regularPrice) : '',
            salePrice: product.salePrice != null ? String(product.salePrice) : '',
            startDate: toLocal(product.saleStart),
            endDate: toLocal(product.saleEnd),
        },
        inventory: {
            sku: product.sku ?? '',
            trackStock: product.manageStock ?? false,
            quantity: product.stockQuantity != null ? String(product.stockQuantity) : '',
            stockStatus: product.stockStatus ?? '',
            soldIndividually: false,
        },
        shipping: {
            weight: product.weight != null ? String(product.weight) : '',
            width: product.width != null ? String(product.width) : '',
            height: product.height != null ? String(product.height) : '',
            depth: product.length != null ? String(product.length) : '',
            shippingClass: '',
        },
        advanced: {
            purchaseNote: product.purchaseNote ?? '',
            enableReviews: product.enabledReviews ?? false,
        },
    }
}

const SimpleProductTable = ({ setSampleProductData, defaultProductData }: { setSampleProductData: (data: any) => void; defaultProductData?: any }) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [generalData, setGeneralDataState] = useState<any>(null);
    const [inventoryData, setInventoryDataState] = useState<any>(null);
    const [shippingData, setShippingDataState] = useState<any>(null);
    const [linkedProductsData, setLinkedProductsDataState] = useState<any>(null);
    const [attributesData, setAttributesDataState] = useState<any>({});
    const [advancedData, setAdvancedDataState] = useState<any>(null);

    const defaultData = useMemo(() => buildDefaultsFromProduct(defaultProductData), [defaultProductData])

    const setGeneralData = (data: any) => setGeneralDataState(data)
    const setInventoryData = (data: any) => setInventoryDataState(data)
    const setShippingData = (data: any) => setShippingDataState(data)
    const setLinkedProductsData = (data: any) => setLinkedProductsDataState(data)
    const setAttributesData = (data: any) => setAttributesDataState(data)
    const setAdvancedData = (data: any) => setAdvancedDataState(data)

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
                        <General setGeneralData={setGeneralData} defaultData={defaultData.general} />
                    </>
                }
                {
                    activeTab === 1 && <>
                        <Inventory setInventoryData={setInventoryData} defaultData={defaultData.inventory} />
                    </>
                }
                {
                    activeTab === 2 && <>
                        <Shipping setShippingData={setShippingData} defaultData={defaultData.shipping} />
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
                        <Advanced setAdvancedData={setAdvancedData} defaultData={defaultData.advanced} />
                    </>
                }
            </div>
        </>
    )
}

export default SimpleProductTable