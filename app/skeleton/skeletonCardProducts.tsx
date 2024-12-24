import React from 'react'

const SkeletonCardProducts = () => {
    return (
        <div className="md:w-[220px] w-[400px] shadow-lg p-10 md:p-2 rounded-lg animate-pulse">
         
            <div className="relative h-[160px] bg-gray-200 rounded-md"></div>

         
            <div className="h-6 bg-gray-200 rounded-md my-3 mx-auto w-3/4"></div>

  
            <div className="flex flex-row justify-center my-3">
                <div className="h-4 bg-gray-200 rounded-md w-1/3 mr-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-10"></div>
            </div>

   
            <div className="h-6 bg-gray-200 rounded-md mx-auto w-1/2 my-3"></div>
        </div>
    )
}

export default SkeletonCardProducts