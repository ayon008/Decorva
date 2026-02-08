import React, { Suspense } from 'react'
import Add from './Add';

const AddProductPage = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}><Add /></Suspense>
        </>
    )
}

export default AddProductPage;