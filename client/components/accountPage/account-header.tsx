'use client'

import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import useUser from "@/hooks/useUser"
import { useUserStore } from "@/app/store/useUserStore"
import { toast } from "sonner"
import { AlertCircle, CheckCircle2, Coins } from "lucide-react"

const AccountHeader = () => {
  const { user } = useUser()
  const { creditsLeft } = useUserStore()

  const handleVerifyEmail = async () => {
    try {
      // Add your email verification API call here
    } catch (error) {
      console.error(error)
      toast.error('Failed to send verification email')
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center">
      <div className="flex flex-col items-between justify-center gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold text-primary">
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </div>

        {/* Credits & Upgrade */}
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
          >
            <Coins className="w-4 h-4 text-primary" />
            {creditsLeft} credits left
          </Badge>
          {!user.isPro && (
            <Link href='/pricing' className=" cursor-pointer flex items-center gap-2 text-xs text-primary hover:underline">
              Get More Credits →
            </Link>
          )}
        </div>
      </div>

      {/* Email Verification Status */}
      {user?.isAuthenticated ? (
        <Alert
          variant="default"
          className="flex items-center gap-3 bg-primary/10 border-primary/20 text-primary"
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <AlertDescription className="text-sm font-medium">
            Your email has been verified. You&apos;re all set!
          </AlertDescription>
        </Alert>
      ) : (
        <Alert
          variant="default"
          className="flex items-center justify-between gap-3 bg-destructive/10 border-destructive/20 text-destructive"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <AlertDescription className="text-sm font-medium">
              Please verify your email address to unlock all features.
            </AlertDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVerifyEmail}
                className="border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                Verify Email
              </Button>
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
        </Alert>
      )}
    </div>
  )
}

export default AccountHeader
