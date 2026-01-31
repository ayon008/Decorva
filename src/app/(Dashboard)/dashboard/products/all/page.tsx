'use client'

import { Edit, Eye, Image as ImageIcon, Trash } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import Skeleton from '@/Shared/Loader/Skeleton'
import { useCallback, useMemo, useState } from 'react'
import { ProductStatus, ProductType, StockStatus } from '@prisma/client'

const COL_COUNT = 11

type ProductImage = { url: string }
type ProductCategory = { name: string }
type ProductTag = { name: string }
type ProductBrand = { name: string }

interface ProductListItem {
    id: string
    name: string
    slug?: string
    sku?: string | null
    price?: number | null
    stockStatus: string
    productType: string
    featured: boolean
    createdAt: string
    categoryIds?: string[]
    productBrandId?: string | null
    productBrand?: ProductBrand | null
    categories?: ProductCategory[]
    tags?: ProductTag[]
    images?: ProductImage[]
}

interface CategoryOption {
    id: string
    name: string
}

interface BrandOption {
    id: string
    name: string
    slug?: string
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        const text = await response.text()
        let message = `Request failed (${response.status})`
        try {
            const data = JSON.parse(text)
            if (data?.message) message = data.message
        } catch {
            if (text) message = text.slice(0, 100)
        }
        throw new Error(message)
    }
    return response.json()
}

function formatPrice(value: number | null | undefined): string {
    if (value == null) return '—'
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 2 }).format(value)
}

function formatStockStatus(status: StockStatus): string {
    const map: Record<StockStatus, string> = {
        [StockStatus.INSTOCK]: 'In Stock',
        [StockStatus.OUTOFSTOCK]: 'Out of Stock',
        [StockStatus.ONBACKORDER]: 'On Backorder',
    }
    return map[status] ?? ''
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—'
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const AllProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedBrand, setSelectedBrand] = useState<string>('all')
    const [selectedProductType, setSelectedProductType] = useState<string>('all')
    const [selectedStockStatus, setSelectedStockStatus] = useState<string>('all')

    const {
        data: products = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['allProducts'],
        queryFn: async () => {
            const data = await fetchJson<{ products?: ProductListItem[] }>('/api/product')
            return data.products ?? []
        },
        staleTime: 60 * 1000,
    })

    const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const data = await fetchJson<{ categories?: CategoryOption[] }>('/api/category')
            return data.categories ?? []
        },
    })

    const { data: brands = [], isLoading: isBrandsLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const data = await fetchJson<{ data?: BrandOption[] }>('/api/product/brand')
            return data.data ?? []
        },
    })

    const handleDelete = useCallback(
        (id: string) => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You want to delete this product?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#79A206',
            }).then(async (result) => {
                if (!result.isConfirmed) return

                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait.',
                    icon: 'info',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                })

                try {
                    const response = await fetch(`/api/product/${id}`, { method: 'DELETE' })
                    const data = await response.json()

                    if (data?.success) {
                        await refetch()
                        await Swal.fire({
                            icon: 'success',
                            title: 'Done',
                            text: data.message ?? 'Product deleted.',
                        })
                    } else {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data?.message ?? 'Delete failed.',
                        })
                    }
                } catch {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not delete product. Please try again.',
                    })
                }
            })
        },
        [refetch]
    )

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return []
        return products.filter((product) => {
            if (selectedCategory !== 'all' && !product.categoryIds?.includes(selectedCategory)) return false
            if (selectedBrand !== 'all' && product.productBrandId !== selectedBrand) return false
            if (selectedProductType !== 'all' && product.productType !== selectedProductType) return false
            if (selectedStockStatus !== 'all' && product.stockStatus !== selectedStockStatus) return false
            return true
        })
    }, [products, selectedCategory, selectedBrand, selectedProductType, selectedStockStatus])

    const firstImageUrl = (product: ProductListItem) =>
        product.images?.[0]?.url

    return (
        <div className="flex flex-col gap-4" role="region" aria-label="Products list">
            <header className="flex flex-wrap items-center gap-4">
                <h1 className="text-2xl font-semibold">Products</h1>
                <Link
                    href="/dashboard/products/add"
                    className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-white transition-all duration-200 hover:bg-primary/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-[0.97]"
                >
                    Add new product
                </Link>
            </header>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
                <label className="sr-only" htmlFor="filter-category">
                    Category
                </label>
                <select
                    id="filter-category"
                    aria-label="Filter by category"
                    className="rounded-sm border border-black/30 p-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">All categories</option>
                    {!isCategoriesLoading && categories.length > 0 &&
                        categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                </select>

                <label className="sr-only" htmlFor="filter-product-type">
                    Product type
                </label>
                <select
                    id="filter-product-type"
                    aria-label="Filter by product type"
                    className="rounded-sm border border-black/30 p-2"
                    value={selectedProductType}
                    onChange={(e) => setSelectedProductType(e.target.value)}
                    title='Select a product type'
                >
                    <option value="all">All types</option>
                    <option value={ProductType.SIMPLE}>Simple</option>
                    <option value={ProductType.VARIABLE}>Variable</option>
                </select>

                <label className="sr-only" htmlFor="filter-stock">
                    Stock status
                </label>
                <select
                    id="filter-stock"
                    aria-label="Filter by stock status"
                    className="rounded-sm border border-black/30 p-2"
                    value={selectedStockStatus}
                    onChange={(e) => setSelectedStockStatus(e.target.value)}
                    title='Select a stock status'
                >
                    <option value="all">All statuses</option>
                    <option value={StockStatus.INSTOCK}>In Stock</option>
                    <option value={StockStatus.OUTOFSTOCK}>Out of Stock</option>
                    <option value={StockStatus.ONBACKORDER}>On Backorder</option>
                </select>

                <label className="sr-only" htmlFor="filter-brand">
                    Brand
                </label>
                <select
                    id="filter-brand"
                    aria-label="Filter by brand"
                    className="rounded-sm border border-black/30 p-2"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    title='Select a brand'
                >
                    <option value="all">All brands</option>
                    {!isBrandsLoading && brands.length > 0 &&
                        brands?.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                </select>
            </div>

            {isError && (
                <div
                    className="rounded-sm border border-red-200 bg-red-50 p-4 text-red-800"
                    role="alert"
                >
                    <p className="font-medium">Failed to load products</p>
                    <p className="mt-1 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 rounded-sm bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-sm border border-black/30 bg-white">
                <table className="w-full border-collapse text-xs" role="table" aria-label="Products table">
                    <thead className="border-b border-black/50 bg-[#FAFAFA]">
                        <tr className="text-left">
                            <th className="p-2" scope="col" aria-label="Image">
                                <ImageIcon className="mx-auto h-4 w-4" aria-hidden />
                            </th>
                            <th className="p-2 text-left" scope="col">
                                Name
                            </th>
                            <th className="p-2" scope="col">
                                SKU
                            </th>
                            <th className="p-2" scope="col">
                                Stock
                            </th>
                            <th className="p-2" scope="col">
                                Price
                            </th>
                            <th className="p-2" scope="col">
                                Categories
                            </th>
                            <th className="p-2" scope="col">
                                Tags
                            </th>
                            <th className="p-2" scope="col">
                                Brand
                            </th>
                            <th className="p-2" scope="col">
                                Featured
                            </th>
                            <th className="p-2" scope="col">
                                Date
                            </th>
                            <th className="p-2" scope="col">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="border-b border-black/50 bg-[#F6F7F7]">
                                <td colSpan={COL_COUNT} className="p-2 text-center">
                                    <div className="flex items-center justify-center py-2">
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-black/50 bg-[#F6F7F7]"
                                >
                                    <td className="p-2 text-center">
                                        {firstImageUrl(product) ? (
                                            <Image
                                                src={firstImageUrl(product)!}
                                                alt=""
                                                width={50}
                                                height={50}
                                                className="mx-auto h-[50px] w-[50px] object-cover"
                                                unoptimized={!firstImageUrl(product)?.startsWith('/')}
                                            />
                                        ) : (
                                            <span
                                                className="mx-auto flex h-[50px] w-[50px] items-center justify-center rounded bg-gray-200"
                                                aria-hidden
                                            >
                                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="max-w-[180px] truncate p-2 capitalize" title={product.name}>
                                        {product.name}
                                    </td>
                                    <td className="p-2">{product.sku ?? '—'}</td>
                                    <td className="p-2">{formatStockStatus(product.stockStatus as StockStatus)}</td>
                                    <td className="p-2">{formatPrice(product.price)}</td>
                                    <td className="max-w-[120px] truncate p-2">
                                        {product.categories?.map((c) => c.name).join(', ') || '—'}
                                    </td>
                                    <td className="max-w-[120px] truncate p-2">
                                        {product.tags?.map((t) => t.name).join(', ') || '—'}
                                    </td>
                                    <td className="p-2">{product.productBrand?.name ?? '—'}</td>
                                    <td className="p-2">{product.featured ? 'Yes' : 'No'}</td>
                                    <td className="whitespace-nowrap p-2">{formatDate(product.createdAt)}</td>
                                    <td className="p-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={`/dashboard/products/add?edit=${product.id}`}
                                                aria-label={`Edit ${product.name}`}
                                                className="text-current hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product.id)}
                                                aria-label={`Delete ${product.name}`}
                                                className="text-current hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/50"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                            <Link
                                                href={`/product/${product.slug ?? product.id}`}
                                                aria-label={`View ${product.name}`}
                                                className="text-current hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/50"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b border-black/50 bg-[#F6F7F7]">
                                <td colSpan={COL_COUNT} className="p-8 text-center">
                                    <p className="text-gray-500">No products found</p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Try changing filters or add a new product.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllProductsPage
