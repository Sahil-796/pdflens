'use client'
import React from 'react'
import StickyBanner from '../ui/sticky-banner'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useUser from '@/hooks/useUser'

const VerifyEmailBanner = () => {
    const { loading, user } = useUser()
    if (loading || !user.id) return
    return (
        <StickyBanner hideOnScroll={true}>
            <div className="flex items-center justify-center gap-2 text-center sm:text-left sm:flex-row flex-col">
                <span className='font-medium text-sm sm:text-base'>Please check your email to verify your accout.</span>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" className='cursor-pointer'>Resend Email</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Verification Email</AlertDialogTitle>
                            <AlertDialogDescription>
                                We have sent you a new verification email, please check both your inbox and spam folder.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </StickyBanner>
    )
}

export default VerifyEmailBanner