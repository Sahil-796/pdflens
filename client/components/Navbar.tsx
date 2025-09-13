import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import ThemeToggle from './ThemeStyle'

const Navbar = () => {
    return (
        <nav className='bg-background fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 shadow-md'>
            <Link href='/' className='font-bold'>
                PDF Lens
            </Link>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                    <SignInButton>
                        <button className="text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
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