'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Dot, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { toast } from "sonner"
import useUser from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/app/store/useUserStore"
import { authClient } from "@/lib/auth-client"

const AccountSettings = () => {
    const { user, loading, isAuthenticated } = useUser()
    const { clearUser } = useUserStore()
    const router = useRouter()
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [updating, setUpdating] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const [, setDeleteLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [changingPassword, setChangingPassword] = useState(false)

    const handleDeleteAccount = async () => {
        try {
            setDeleteLoading(true)
            if (confirmText.trim().toLowerCase() !== "delete my account") return
            await authClient.deleteUser()
            clearUser()
            toast.success("Account deleted!")
            router.push('/goodbye')
        } catch (error) {
            console.error(error)
            toast.error("Confirmation text incorrect.")
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true)
            if (!isAuthenticated) {
                toast.error('You must be authenticated to update your profile')
                return
            }
            if (name.trim().length === 0) {
                toast.error('Name cannot be empty')
                return
            }
            await authClient.updateUser({
                name: name.trim()
            })
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to update profile')
        } finally {
            setUpdating(false)
        }
    }

    const handleVerifyEmail = async () => {
        try {
            // Add your email verification API call here
            toast.success('Verification email sent')
        } catch (error) {
            console.error(error)
            toast.error('Failed to send verification email')
        }
    }

    const handleChangePassword = async () => {
        try {
            setChangingPassword(true)
            if (!isAuthenticated) {
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
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className='h-full w-full max-w-3xl mx-auto my-auto p-6'>
            <Card className="border-border bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold text-primary">Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your account settings and set email preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Name {name !== user.name && <Dot className="text-primary -ml-2 scale-140 animate-caret-blink" />}</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9 bg-background border-border focus:ring-primary"
                                        disabled={!isAuthenticated}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email {email !== user.email && <Dot className="text-primary -ml-2 scale-140 animate-caret-blink" />}</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 bg-background border-border focus:ring-primary"
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Verification Status */}
                        {isAuthenticated ? (
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleVerifyEmail}
                                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                                >
                                    Verify Email
                                </Button>
                            </Alert>
                        )}

                        <Button
                            onClick={handleUpdateProfile}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={updating || !isAuthenticated}
                        >
                            {updating ? 'Updating...' : 'Update Name'}
                        </Button>
                    </div>

                    <Separator className="bg-border" />

                    {/* Password Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-foreground">Password</h3>
                        <div className="space-y-2">
                            <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="bg-background border-border focus:ring-primary"
                                disabled={!isAuthenticated}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-background border-border focus:ring-primary"
                                disabled={!isAuthenticated}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-background border-border focus:ring-primary"
                                disabled={!isAuthenticated}
                            />
                        </div>
                        <Button
                            onClick={handleChangePassword}
                            variant="outline"
                            disabled={!isAuthenticated || changingPassword}
                            className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                        >
                            {changingPassword ? 'Changing...' : 'Change Password'}
                        </Button>
                    </div>

                    <Separator className="bg-border" />

                    {/* Danger Zone */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-card border-border">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-foreground">
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                        This action cannot be undone. Type <span className="font-semibold text-destructive">&quot;delete my account&quot;</span> below to confirm.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="py-3">
                                    <input
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder='Type "delete my account"'
                                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/40"
                                    />
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-border hover:bg-accent">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        disabled={confirmText.trim().toLowerCase() !== "delete my account"}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Delete Account
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