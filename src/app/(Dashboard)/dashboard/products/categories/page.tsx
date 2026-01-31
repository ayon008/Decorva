'use client'

import PopUp from '@/Shared/PopUp/PopUp'
import Skeleton from '@/Shared/Loader/Skeleton'
import { Edit, Trash, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'

type Category = { id: string; name: string; slug: string; count?: number; parentId?: string | null }

const CategoriesPage = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [editName, setEditName] = useState('')
    const [editSlug, setEditSlug] = useState('')
    const [editParentId, setEditParentId] = useState<string>('')
    const [addName, setAddName] = useState('')
    const [addSlug, setAddSlug] = useState('')
    const [addParentId, setAddParentId] = useState<string>('')

    const { data: categories, isLoading, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/category')
            const data = await response.json()
            if (!response.ok) throw new Error(data?.message ?? 'Failed to fetch categories')
            return (data.categories ?? []) as Category[]
        },
    })

    const openEdit = useCallback((cat: Category) => {
        setEditingCategory(cat)
        setEditName(cat.name)
        setEditSlug(cat.slug)
        setEditParentId(cat.parentId ?? '')
        setIsOpen(true)
    }, [])

    const closeEdit = useCallback(() => {
        setIsOpen(false)
        setEditingCategory(null)
        setEditName('')
        setEditSlug('')
        setEditParentId('')
    }, [])

    const handleDelete = useCallback(async (cat: Category) => {
        const result = await Swal.fire({
            title: 'Delete category?',
            text: `"${cat.name}" will be removed. This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#79A206',
        })
        if (!result.isConfirmed) return

        try {
            const response = await fetch(`/api/category/${encodeURIComponent(cat.slug)}`, { method: 'DELETE' })
            const data = await response.json()
            if (data.success) {
                await refetch()
                await Swal.fire({ icon: 'success', title: 'Deleted', text: data.message })
            } else {
                await Swal.fire({ icon: 'error', title: 'Error', text: data.message ?? 'Delete failed' })
            }
        } catch {
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Could not delete category' })
        }
    }, [refetch])

    const handleEditSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingCategory) return
        try {
            const response = await fetch(`/api/category/${encodeURIComponent(editingCategory.slug)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, slug: editSlug, parentId: editParentId || null }),
            })
            const data = await response.json()
            if (data.success) {
                await refetch()
                closeEdit()
                await Swal.fire({ icon: 'success', title: 'Updated', text: data.message })
            } else {
                await Swal.fire({ icon: 'error', title: 'Error', text: data.message ?? 'Update failed' })
            }
        } catch {
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Could not update category' })
        }
    }, [editingCategory, editName, editSlug, editParentId, refetch, closeEdit])

    const handleAddSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const name = addName.trim()
        if (!name) {
            await Swal.fire({ icon: 'warning', title: 'Required', text: 'Category name is required' })
            return
        }
        try {
            const response = await fetch('/api/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    slug: addSlug.trim() || undefined,
                    parentId: addParentId || null,
                }),
            })
            const data = await response.json()
            if (data.success) {
                setAddName('')
                setAddSlug('')
                setAddParentId('')
                await refetch()
                await Swal.fire({ icon: 'success', title: 'Created', text: data.message })
            } else {
                await Swal.fire({ icon: 'error', title: 'Error', text: data.message ?? 'Create failed' })
            }
        } catch {
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Could not create category' })
        }
    }, [addName, addSlug, addParentId, refetch])

    return (
        <>
            <div className='flex flex-col gap-4'>
                <span className='text-2xl font-semibold'>
                    Product Categories
                </span>
                <div className='flex flex-row items-start justify-between gap-6'>
                    <div className='w-[30%] flex flex-col gap-4'>
                        <form onSubmit={handleAddSubmit} className='flex flex-col gap-4'>
                            <h4 className='text-lg font-semibold'>Add new category</h4>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='add-category-name' className='text-sm font-medium'>Category name</label>
                                <input
                                    type='text'
                                    id='add-category-name'
                                    placeholder='Category name'
                                    className='border border-black/30 rounded-sm p-2'
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='add-category-parent' className='text-sm font-medium'>Category parent</label>
                                <select
                                    id='add-category-parent'
                                    className='border border-black/30 rounded-sm p-2'
                                    value={addParentId}
                                    onChange={(e) => setAddParentId(e.target.value)}
                                >
                                    <option value=''>None</option>
                                    {!isLoading && categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='add-slug' className='text-sm font-medium'>Slug (optional, auto from name)</label>
                                <input
                                    type='text'
                                    id='add-slug'
                                    placeholder='Slug'
                                    className='border border-black/30 rounded-sm p-2'
                                    value={addSlug}
                                    onChange={(e) => setAddSlug(e.target.value)}
                                />
                            </div>
                            <button type='submit' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'>
                                Add new category
                            </button>
                        </form>
                    </div>
                    <div className='w-[70%] overflow-x-auto rounded-sm border border-black/30 bg-white'>
                        <table className='w-full border-collapse p-3 text-xs'>
                            <thead className='bg-[#FAFAFA] border-b border-b-black/50'>
                                <tr className='text-left'>
                                    <th className='p-2 text-left' scope='col'>Name</th>
                                    <th className='p-2' scope='col'>Slug</th>
                                    <th className='p-2' scope='col'>Count</th>
                                    <th className='p-2' scope='col'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className='border-b border-b-black/50 bg-[#F6F7F7]'>
                                            <td className='p-2' colSpan={4}>
                                                <Skeleton className='h-10 w-full' />
                                            </td>
                                        </tr>
                                    ))
                                ) : categories?.length ? (
                                    categories.map((cat) => (
                                        <tr key={cat.id} className='border-b border-b-black/50 bg-[#F6F7F7]'>
                                            <td className='p-2 text-left'>{cat.name}</td>
                                            <td className='p-2 text-left'>{cat.slug}</td>
                                            <td className='p-2 text-left'>{cat.count ?? 0}</td>
                                            <td className='p-2 text-center'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <Edit onClick={() => openEdit(cat)} className='w-4 h-4 cursor-pointer hover:text-primary transition-all duration-200' aria-label={`Edit ${cat.name}`} />
                                                    <Trash onClick={() => handleDelete(cat)} className='w-4 h-4 cursor-pointer hover:text-primary transition-all duration-200' aria-label={`Delete ${cat.name}`} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className='border-b border-b-black/50 bg-[#F6F7F7]'>
                                        <td className='p-8 text-center text-gray-500' colSpan={4}>
                                            No categories found. Add one above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className='bg-[#FAFAFA] border-t border-black/50'>
                                <tr className='text-left'>
                                    <th className='p-2 text-left' scope='col'>Name</th>
                                    <th className='p-2' scope='col'>Slug</th>
                                    <th className='p-2' scope='col'>Count</th>
                                    <th className='p-2' scope='col'>Actions</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            {/* Edit Category PopUp */}
            <PopUp fn={(open) => { if (!open) closeEdit(); setIsOpen(open); }} isOpen={isOpen}>
                <div className='w-full h-full relative flex items-center justify-center'>
                    <button type='button' className='absolute top-5 right-5 z-10 rounded-full border border-black text-black p-1 cursor-pointer' onClick={closeEdit} aria-label='Close'>
                        <X className='w-5 h-5' />
                    </button>
                    <div onClick={(e) => e.stopPropagation()} className='h-[80%] max-w-lg w-full bg-white rounded-sm p-4 overflow-y-auto'>
                        <span className='text-2xl font-semibold'>
                            {editingCategory ? 'Edit category' : 'Product Categories'}
                        </span>
                        <div className='flex flex-col gap-4 mt-4'>
                            <form onSubmit={handleEditSubmit} className='flex flex-col gap-4'>
                                <h4 className='text-lg font-semibold'>{editingCategory ? 'Edit category' : 'Add new category'}</h4>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor='edit-category-name' className='text-sm font-medium'>Category name</label>
                                    <input type='text' id='edit-category-name' placeholder='Category name' className='border border-black/30 rounded-sm p-2' value={editName} onChange={(e) => setEditName(e.target.value)} required />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor='edit-category-parent' className='text-sm font-medium'>Category parent</label>
                                    <select id='edit-category-parent' className='border border-black/30 rounded-sm p-2' value={editParentId} onChange={(e) => setEditParentId(e.target.value)}>
                                        <option value=''>None</option>
                                        {!isLoading && categories?.filter((c) => c.id !== editingCategory?.id).map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor='edit-slug' className='text-sm font-medium'>Slug</label>
                                    <input type='text' id='edit-slug' placeholder='Slug' className='border border-black/30 rounded-sm p-2' value={editSlug} onChange={(e) => setEditSlug(e.target.value)} required />
                                </div>
                                <button type='submit' className='bg-primary text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-primary/80 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'>
                                    {editingCategory ? 'Update category' : 'Add new category'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </PopUp>
        </>
    )
}
export default CategoriesPage;