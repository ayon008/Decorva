/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import ProductBrand from '@/Components/Dashboard/Products/ProductBrand';
import ProductCategories from '@/Components/Dashboard/Products/ProductCategories';
import ProductDescription from '@/Components/Dashboard/Products/ProductDescription';
import ProductFeatureImage from '@/Components/Dashboard/Products/ProductFeatureImage';
import ProductGallery from '@/Components/Dashboard/Products/ProductGallery';
import ProductTags from '@/Components/Dashboard/Products/ProductTags';
import SimpleProductTable from '@/Components/Dashboard/Products/SimpleProductTable';
import VariableProductTable from '@/Components/Dashboard/Products/VariableProduct';
import { ProductStatus, ProductType, ProductVisibility, StockStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

/** Finds img tags with data: or blob: src, uploads each to ImgBB, replaces src with ImgBB URL. */
async function uploadHtmlImagesToImgBB(html: string): Promise<string> {
    if (!html || !html.includes('<img')) return html
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const imgs = Array.from(doc.querySelectorAll<HTMLImageElement>('img'))
    const toUpload = imgs.filter((img) => img.src?.startsWith('data:') || img.src?.startsWith('blob:'))
    await Promise.all(
        toUpload.map(async (img) => {
            try {
                const res = await fetch(img.src)
                const blob = await res.blob()
                const ext = blob.type.split('/')[1] || 'png'
                const file = new File([blob], `image-${Date.now()}.${ext}`, { type: blob.type })
                const formData = new FormData()
                formData.append('file', file)
                const uploadRes = await fetch('/api/upload-image', { method: 'POST', body: formData })
                const data = await uploadRes.json()
                if (data?.url) img.setAttribute('src', data.url)
            } catch {
                // keep original src on failure
            }
        })
    )
    return doc.body?.innerHTML ?? html
}


const AddProductPage = () => {

    const [productType, setProductType] = useState<string>('simple');
    const [productName, setProductName] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [productShortDescription, setProductShortDescription] = useState<string>('');
    const [productDescriptionHtml, setProductDescriptionHtml] = useState<string>('');
    const [productShortDescriptionHtml, setProductShortDescriptionHtml] = useState<string>('');
    const [sampleProductData, setSampleProductData] = useState<any>(null);
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [featured, setFeatured] = useState<boolean>(false);
    const [formKey, setFormKey] = useState(0);

    const clearForm = () => {
        setProductName('');
        setProductDescription('');
        setProductShortDescription('');
        setProductDescriptionHtml('');
        setProductShortDescriptionHtml('');
        setSampleProductData(null);
        setFeaturedImage(null);
        setGalleryImages([]);
        setTags([]);
        setSelectedBrand('');
        setSelectedCategory([]);
        setFeatured(false);
        setProductType('simple');
        setFormKey((k) => k + 1);
    };

    const handleProductDescriptionChange = (data: { productDescription: string; productDescriptionHtml: string }) => {
        setProductDescription(data.productDescription)
        setProductDescriptionHtml(data.productDescriptionHtml)
    }

    const handleShortDescriptionChange = (data: { productDescription: string; productDescriptionHtml: string }) => {
        setProductShortDescription(data.productDescription)
        setProductShortDescriptionHtml(data.productDescriptionHtml)
    }

    const searchParams = useSearchParams();
    const productId = searchParams.get('edit');

    const { data: product } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await fetch(`/api/product/${productId}`);
            const data = await response.json();
            return data.product;
        },
        enabled: !!productId,
    });

    const images = [...galleryImages, featuredImage].filter((image): image is File => image != null);

    const productData = {
        name: productName,
        slug: productName.toLowerCase().replace(/ /g, '-'),
        descriptionText: productDescription,
        shortDescriptionText: productShortDescription,
        sku: sampleProductData?.inventory?.sku,
        status: ProductStatus.PUBLISH,
        visibility: ProductVisibility.VISIBLE,
        featured,
        productType: productType === 'simple' ? ProductType.SIMPLE : ProductType.VARIABLE,
        price: Number(sampleProductData?.general?.regularPrice),
        downloadable: false,
        virtual: false,
        length: Number(sampleProductData?.shipping?.length),
        width: Number(sampleProductData?.shipping?.width),
        height: Number(sampleProductData?.shipping?.depth),
        weight: Number(sampleProductData?.shipping?.weight),
        stockStatus: sampleProductData?.inventory?.stockStatus as StockStatus,
        manageStock: sampleProductData?.inventory?.trackStock,
        stockQuantity: Number(sampleProductData?.inventory?.quantity),
        salePrice: Number(sampleProductData?.general?.salePrice),
        saleStart: sampleProductData?.general?.startDate,
        saleEnd: sampleProductData?.general?.endDate,
        regularPrice: Number(sampleProductData?.general?.regularPrice),
        enabledReviews: sampleProductData?.advanced?.enableReviews,
        purchaseNote: sampleProductData?.advanced?.purchaseNote,
        productBrand: selectedBrand,
        categories: selectedCategory
    }


    const handlePublishProduct = async () => {
        if (productType === 'simple') {
            const regularPrice = sampleProductData?.general?.regularPrice;
            const priceNum = regularPrice != null && regularPrice !== '' ? Number(regularPrice) : NaN;
            if (!regularPrice || regularPrice === '' || Number.isNaN(priceNum) || priceNum < 0) {
                await Swal.fire({
                    title: 'Validation',
                    text: 'Regular price is required and must be a valid number.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });
                return;
            }
        }
        const startDate = sampleProductData?.general?.startDate;
        const endDate = sampleProductData?.general?.endDate;
        if (startDate && endDate) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            if (!Number.isNaN(startTime) && !Number.isNaN(endTime) && endTime < startTime) {
                await Swal.fire({
                    title: 'Validation',
                    text: 'End date cannot be earlier than start date.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });
                return;
            }
        }
        Swal.fire({
            title: productId ? 'Updating product...' : 'Publishing product...',
            text: 'Please wait',
            icon: 'info',
            showConfirmButton: false,
        });
        const imageUrls: string[] = [];
        if (productId && product?.images?.length) {
            imageUrls.push(...product.images.map((img: { url: string }) => img.url));
        }
        if (images.length > 0) {
            const results = await Promise.all(
                images.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
                    const data = await res.json();
                    return data?.url ?? null;
                })
            );
            imageUrls.push(...results.filter((url): url is string => url != null));
        }

        const descriptionHtmlWithImgBB = await uploadHtmlImagesToImgBB(productDescriptionHtml);
        const shortDescriptionHtmlWithImgBB = await uploadHtmlImagesToImgBB(productShortDescriptionHtml);

        const payload = {
            ...productData,
            descriptionHtml: descriptionHtmlWithImgBB,
            shortDescriptionHtml: shortDescriptionHtmlWithImgBB,
            images: imageUrls,
        };

        const url = productId ? `/api/product/${productId}` : '/api/product';
        const method = productId ? 'PATCH' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
            if (!productId) clearForm();
            await Swal.fire({
                title: productId ? 'Product updated' : 'Product created successfully',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } else {
            Swal.fire({
                title: productId ? 'Update failed' : 'Product creation failed',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // Sync form state when product loads (edit mode). Batched in queueMicrotask to satisfy React Compiler.
    useEffect(() => {
        if (!product) return;
        queueMicrotask(() => {
            setProductName(product.name ?? '');
            setProductDescription(product.descriptionText ?? '');
            setProductShortDescription(product.shortDescriptionText ?? '');
            setProductDescriptionHtml(product.descriptionHtml ?? '');
            setProductShortDescriptionHtml(product.shortDescriptionHtml ?? '');
            setProductType(product.productType === 'VARIABLE' ? 'variable' : 'simple');
            setSelectedBrand(product.productBrandId ?? '');
            setSelectedCategory(product.categoryIds ?? []);
            setTags(product.tags?.map((t: { name: string }) => t.name) ?? []);
            setFeatured(product.featured ?? false);
        });
    }, [product]);



    return (
        <section className=''>
            <h2 className='text-2xl mb-4'>Add new product</h2>
            <div key={formKey} className='w-full flex items-start justify-between gap-6'>
                <aside className='w-3/4 flex flex-col gap-4'>
                    <input type="text" placeholder='Product name' className='w-full p-2 border border-black/30 rounded-sm' value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <ProductDescription heading="Product Description" height="400px" onChange={handleProductDescriptionChange} defaultContent={productDescriptionHtml} />
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
                                    <SimpleProductTable setSampleProductData={setSampleProductData} defaultProductData={product} />
                                )
                            }
                            {
                                productType === 'variable' && (
                                    <VariableProductTable setSampleProductData={setSampleProductData} />
                                )
                            }
                        </div>
                    </div>
                    <ProductDescription heading="Product Short Description" height="300px" onChange={handleShortDescriptionChange} defaultContent={productShortDescriptionHtml} />
                </aside>
                <aside className='w-1/4 flex flex-col gap-4'>
                    <div className='bg-white p-3 flex flex-col gap-2 border border-black/30'>
                        <div className='text-base border-b border-b-black/30 pb-2'>
                            Publish
                        </div>
                        <label className='flex items-center gap-2 cursor-pointer mt-2'>
                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className='w-4 h-4 rounded border-black/30 cursor-pointer accent-primary'
                            />
                            <span className='text-sm'>Featured product</span>
                        </label>
                        <button onClick={() => handlePublishProduct()} type='button' className='border border-primary bg-white text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer px-4 py-2 rounded-sm text-xs w-fit mt-1 ml-auto'>
                            Publish
                        </button>
                    </div>
                    <ProductFeatureImage setFeaturedImage={setFeaturedImage} defaultImageUrl={product?.images?.[0]?.url ?? null} />
                    <ProductGallery setGalleryImages={setGalleryImages} defaultImageUrls={product?.images?.map((img: { id: string; url: string }) => ({ id: img.id, url: img.url })) ?? []} />
                    <ProductCategories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} defaultSelectedCategoryIds={product?.categoryIds ?? []} />
                    <ProductTags tags={tags} setTags={setTags} />
                    <ProductBrand selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} defaultSelectedBrandId={product?.productBrandId ?? ''} />
                </aside>
            </div>
        </section>
    )
}

export default AddProductPage;