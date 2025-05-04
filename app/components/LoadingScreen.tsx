import React from 'react'

function LoadingScreen() {
    return (
        <div><div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-lg">Oturum yükleniyor...</p>
            </div>
        </div>{/*  */}</div>
    )
}

export default LoadingScreen