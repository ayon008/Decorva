import React, { Suspense } from 'react'
import Account from './Account';

const page = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}><Account /></Suspense>
        </>
    )
}

export default page;