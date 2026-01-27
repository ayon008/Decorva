'use client'
import Advanced from '@/Components/Dashboard/Products/Advanced';
import Attributes from '@/Components/Dashboard/Products/Attributes';
import General from '@/Components/Dashboard/Products/General';
import Inventory from '@/Components/Dashboard/Products/Inventory';
import LinkedProducts from '@/Components/Dashboard/Products/LinkedProducts';
import Shipping from '@/Components/Dashboard/Products/Shipping';
import { Box, Link, Settings, ShieldCheck, Tag, Truck } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

const AddProductPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const [featurePreviewUrl, setFeaturePreviewUrl] = useState<string | null>(null);
    const [featureFileName, setFeatureFileName] = useState<string | null>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const galleryItemsRef = useRef<{ url: string }[]>([]);
    const [galleryItems, setGalleryItems] = useState<{ id: string; url: string; name: string }[]>([]);



    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
            if (galleryItemsRef.current.length) {
                galleryItemsRef.current.forEach((u) => URL.revokeObjectURL(u.url));
                galleryItemsRef.current = [];
            }
        };
    }, []);

    return (
        <section className=''>
            <h2 className='text-2xl mb-4'>Add new product</h2>
            <div className='w-full flex items-start justify-between gap-6'>
                <aside className='w-3/4 flex flex-col gap-4'>
                    <input type="text" placeholder='Product name' className='w-full p-2 border border-black/50 rounded-sm' />
                    <div className='border border-black/30'>
                        <div className='flex items-center border-b border-black/30 gap-2 py-2 px-3'>
                            <h3>Product Data -</h3>
                            <select
                                className="border border-black/30 rounded-sm text-base py-1"
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
                            <div className='w-[30%] border-r border-black/30 bg-[#FAFAFA]'>
                                <div className={`flex items-center pl-2 py-2 gap-1 border-b border-black/50 cursor-pointer ${activeTab === 0 ? 'bg-[#EEEEEE] text-black/80' : 'bg-[#FAFAFA] text-primary'}`} onClick={() => setActiveTab(0)}>
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
                                    activeTab === 5 && <>
                                        <Advanced />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
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
                    <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
                        <label htmlFor="product-feature-image" className='text-base border-b border-b-black/30 pb-2'>
                            Product feature image
                        </label>
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                name="product-feature-image"
                                id="product-feature-image"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;

                                    if (previewUrlRef.current) {
                                        URL.revokeObjectURL(previewUrlRef.current);
                                        previewUrlRef.current = null;
                                    }

                                    if (!file) {
                                        setFeaturePreviewUrl(null);
                                        setFeatureFileName(null);
                                        e.currentTarget.value = "";
                                        return;
                                    }

                                    const url = URL.createObjectURL(file);
                                    previewUrlRef.current = url;
                                    setFeaturePreviewUrl(url);
                                    setFeatureFileName(file.name);
                                    // allow re-selecting the same file later
                                    e.currentTarget.value = "";
                                }}
                            />

                            {featurePreviewUrl ? (
                                <div className="w-full mt-1">
                                    <Image
                                        src={featurePreviewUrl}
                                        alt={featureFileName ? `Product feature preview: ${featureFileName}` : "Product feature preview"}
                                        width={1200}
                                        height={400}
                                        unoptimized
                                        className="w-full h-auto aspect-square object-cover border border-black/30 rounded-sm"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <button
                                            type="button"
                                            className="text-xs text-primary hover:underline cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Replace Product Image
                                        </button>
                                        <button
                                            type="button"
                                            className="text-xs text-red-600 hover:underline cursor-pointer"
                                            onClick={() => {
                                                if (previewUrlRef.current) {
                                                    URL.revokeObjectURL(previewUrlRef.current);
                                                    previewUrlRef.current = null;
                                                }
                                                setFeaturePreviewUrl(null);
                                                setFeatureFileName(null);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="text-xs text-primary hover:underline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Set Product Image
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
                        <div className='text-base border-b border-b-black/30 pb-2'>
                            Product Gallery
                        </div>
                        <div className='flex flex-col gap-2'>
                            <button
                                type="button"
                                className='text-xs text-primary cursor-pointer w-fit hover:underline text-left'
                                onClick={() => galleryInputRef.current?.click()}
                            >
                                Add product gallery images
                            </button>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                name="product-image"
                                id="product-image"
                                aria-label="Product gallery images"
                                className='hidden'
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files ?? []);
                                    if (!files.length) {
                                        e.currentTarget.value = "";
                                        return;
                                    }

                                    const newItems = files.map((f) => {
                                        const url = URL.createObjectURL(f);
                                        return { id: makeId(), url, name: f.name };
                                    });

                                    galleryItemsRef.current = [...galleryItemsRef.current, ...newItems];
                                    setGalleryItems((prev) => [...prev, ...newItems]);

                                    // allow selecting the same file(s) again
                                    e.currentTarget.value = "";
                                }}
                            />

                            {galleryItems.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {galleryItems.map((item, idx) => (
                                        <div key={item.id} className="relative w-[50px] h-[50px]">
                                            <Image
                                                src={item.url}
                                                alt={item.name ? `Gallery image: ${item.name}` : `Gallery image ${idx + 1}`}
                                                width={50}
                                                height={50}
                                                unoptimized
                                                className="w-[50px] h-[50px] object-cover border border-black/30 rounded-sm aspect-square"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-black/30 text-[10px] leading-none flex items-center justify-center hover:bg-black/5"
                                                aria-label="Remove image"
                                                onClick={() => {
                                                    URL.revokeObjectURL(item.url);
                                                    galleryItemsRef.current = galleryItemsRef.current.filter((u) => u.url !== item.url);
                                                    setGalleryItems((prev) => prev.filter((x) => x.id !== item.id));
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {galleryItems.length > 0 && (
                                <button
                                    type="button"
                                    className="text-xs text-red-600 hover:underline w-fit"
                                    onClick={() => {
                                        galleryItemsRef.current.forEach((u) => URL.revokeObjectURL(u.url));
                                        galleryItemsRef.current = [];
                                        setGalleryItems([]);
                                        if (galleryInputRef.current) galleryInputRef.current.value = "";
                                    }}
                                >
                                    Clear gallery
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default AddProductPage;