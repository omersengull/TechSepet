
import React from 'react'

const pageContainer = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='px-3 md:px-10 py-8'> {children}</div>
    )
}

export default pageContainer