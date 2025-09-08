import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

const Navbar = () => {
    return (
        <nav className='bg-primary flex items-center justify-between px-10'>
            <div className='text-primary-foreground'>
                PDF Lens
            </div>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                    <SignInButton>
                        <button className="text-primary-foreground text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign In
                        </button>
                    </SignInButton>
                    <SignUpButton>
                        <button className="bg-primary-foreground text-primary rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
        </nav>
    )
}

export default Navbar