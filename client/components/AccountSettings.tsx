'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Coins, Dot, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { toast } from "sonner"
import useUser from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/app/store/useUserStore"
import { authClient } from "@/lib/auth-client"
import LumaSpin from "./21st/LumaSpin"
import { Badge } from "./ui/badge"
import { usePdfStore } from "@/app/store/usePdfStore"
import Link from "next/link"

const AccountSettings = () => {
  const { user, loading } = useUser()
  const { clearUser, creditsLeft } = useUserStore()
  const { clearPdf } = usePdfStore()
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [updatingName, setUpdatingName] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [, setDeleteLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [updatingEmail, setUpdatingEmail] = useState(false)

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true)
      if (confirmText.trim().toLowerCase() !== "delete my account") return
      await authClient.deleteUser()
      clearUser()
      clearPdf()
      toast.success("Account deleted!")
      router.push('/goodbye')
    } catch (error) {
      console.error(error)
      toast.error("Confirmation text incorrect.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleUpdateName = async () => {
    try {
      setUpdatingName(true)
      if (!user.isAuthenticated) {
        toast.error('You must be verify your email.')
        return
      }
      if (name.trim().length === 0) {
        toast.error('Name cannot be empty')
        return
      }
      if (name.trim() == user.name) {
        toast.info("Name is same")
        return
      }
      await authClient.updateUser({
        name: name.trim()
      })
      toast.success('Name updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update name')
    } finally {
      setUpdatingName(false)
    }
  }

  const handleUpdateEmail = async () => {
    setUpdatingEmail(true)
    try {
      if (!user.isAuthenticated) {
        toast.error('You must be verify your email.')
        return
      }
      if (email.trim().length === 0) {
        toast.error('Email cannot be empty')
        return
      }
      if (email.trim() == user.email) {
        toast.info("Email cannot be same")
        return
      }
      await authClient.changeEmail({
        newEmail: email.trim()
      })
      toast.success('Verification email sent to new address. Please confirm to complete the update.')

    } catch (err) {
      console.error(err)
      toast.error("Updating email failed.")
    } finally {
      setUpdatingEmail(false)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      // Add your email verification API call here
    } catch (error) {
      console.error(error)
      toast.error('Failed to send verification email')
    }
  }

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true)
      if (!user.isAuthenticated) {
        toast.error('You must be authenticated to change your password')
        return
      }
      if (!currentPassword || !newPassword) {
        toast.error('Please fill in all password fields')
        return
      }
      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      await authClient.changePassword({ currentPassword, newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success('Password changed successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user?.name, user?.email])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LumaSpin />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto my-auto p-6">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-primary">
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your account settings and set email preferences.
              </CardDescription>
            </div>

            {/* Credits & Upgrade */}
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className=""
              >
                <Coins className="w-4 h-4 text-primary" />
                {creditsLeft} credits
              </Badge>
              {!user.isPro && (
                <Link href='/pricing' className=" cursor-pointer flex items-center gap-2 text-xs text-primary hover:underline">
                  Get More Credits →
                </Link>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Email Verification Status */}
          {user.isAuthenticated ? (
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

          {/* Profile Section */}
          <div className="space-y-4">
            {/* Name Update */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="name" className="text-sm font-medium">
                  Display Name
                </Label>
                {name !== user.name && (
                  <Dot className="text-primary -ml-1 scale-140 animate-caret-blink" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-1"
                    disabled={!user.isAuthenticated}
                  />
                </div>
                <Button
                  onClick={handleUpdateName}
                  className="sm:w-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  disabled={updatingName || !user.isAuthenticated}
                >
                  {updatingName ? 'Updating...' : 'Change Name'}
                </Button>
              </div>
            </div>

            {/* Email Update */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                {email !== user.email && (
                  <Dot className="text-primary -ml-1 scale-140 animate-caret-blink" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-1"
                    disabled={user.userProvider !== 'credential' || !user.isAuthenticated}
                  />
                </div>
                {user.userProvider === 'credential' && (
                  <Button
                    onClick={handleUpdateEmail}
                    className="sm:w-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    disabled={user.userProvider !== 'credential' || !user.isAuthenticated}
                  >
                    {updatingEmail ? 'Updating...' : 'Change Email'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Password Section */}
          {/* Password Section */}
          {user.userProvider === 'credential' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Change Password</h3>

              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-background border-border focus:ring-primary"
                  disabled={!user.isAuthenticated}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-background border-border focus:ring-primary"
                  disabled={!user.isAuthenticated}
                />
              </div>

              <div className="">
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background border-border focus:ring-primary"
                  disabled={!user.isAuthenticated}
                />
              </div>

              <Button
                onClick={handleChangePassword}
                variant="outline"
                className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                disabled={
                  !user.isAuthenticated ||
                  changingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword
                }
              >
                {changingPassword ? "Changing..." : "Update Password"}
              </Button>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Danger Zone */}
          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full cursor-pointer text-destructive hover:text-primary"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-card border border-border rounded-xl max-w-sm mx-auto">
                <AlertDialogHeader className="text-center space-y-2">
                  <AlertDialogTitle className="text-lg font-semibold text-foreground">
                    Confirm Account Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    This action <span className="font-semibold text-destructive">cannot be undone</span>.
                    Type <span className="font-medium text-destructive">&quot;delete my account&quot;</span> below to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-4">
                  <Input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder='Type "delete my account"'
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-destructive/50"
                  />
                </div>

                <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                  <AlertDialogCancel className="px-3 py-1 border border-border rounded hover:bg-muted/20 text-sm">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={confirmText.trim().toLowerCase() !== "delete my account"}
                    className="px-3 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountSettings
