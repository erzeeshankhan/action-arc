import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const layout = async ({ children }) => {
    return (
        <div className='mx-auto'>
            <Suspense fallback={<div className='mx-auto'>Loading...</div>}>
                {children}
            </Suspense>
        </div>
    )
}

export default layout