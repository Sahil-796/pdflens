import React from 'react'

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center px-4">
            <h1 className="text-9xl font-extrabold tracking-wider relative">
                <span className="relative z-10">404</span>
                <span className="absolute inset-0 text-white blur-md opacity-80">404</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300">
                This website is still in development.
            </p>
        </div>
    )
}

export default NotFound