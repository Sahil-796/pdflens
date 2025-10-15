import { GalleryVerticalEnd } from "lucide-react"

import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function SignupPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="#" className="flex items-center justify-center">
                    <Logo size="md" showSubtitle={true} showText={true} />
                </Link>
                <SignupForm />
            </div>
        </div>
    )
}
