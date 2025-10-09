import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import ThemeToggle from '../theme/ThemeToggle'
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
import StickyBanner from '@/components/ui/sticky-banner'

const TitleNav = ({ text }: { text: string }) => {
    return (
        <div className='flex flex-col'>
            <StickyBanner hideOnScroll={true}>
                <div className="flex items-center justify-center gap-2">
                    <span>Please check your email to verify your accout.</span>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">Resend Email</Button>
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
            <header className="flex border-b-1 border-b-secondary h-16 shrink-0 justify-between items-center gap-2 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 ">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <h2 className="text-foreground text-lg font-semibold">{text}</h2>
                </div>
                <ThemeToggle />
            </header>
        </div>
    )
}

export default TitleNav