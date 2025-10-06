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

const AccountSettings = () => {
    const { user, loading, isAuthenticated } = useUser()
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (user?.name) {
            setName(user.name)
        }
        if (user?.email) {
            setEmail(user.email)
        }
    }, [user?.name, user?.email])

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

            const res = await fetch('/api/updateProfile', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to update profile')
            }

            toast.success('Profile updated successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setUpdating(false)
        }
    }
    const handleDeleteAccount = async () => {
        try {
            // Add your delete account API call here
            toast.success('Account deleted successfully')
        } catch (error) {
            toast.error('Failed to delete account')
        }
    }

    const handleVerifyEmail = async () => {
        try {
            // Add your email verification API call here
            toast.success('Verification email sent')
        } catch (error) {
            toast.error('Failed to send verification email')
        }
    }

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
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Verification Status */}
                        {isAuthenticated ? (
                            <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>Your email is verified</AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive" className="bg-destructive/10">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="flex-1">
                                    Please verify your email address
                                </AlertDescription>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleVerifyEmail}
                                    className="ml-2"
                                >
                                    Verify Email
                                </Button>
                            </Alert>
                        )}

                        <Button
                            onClick={handleUpdateProfile}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </div>

                    <Separator className="bg-border" />

                    {/* Password Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-foreground">Password</h3>
                        <Button
                            variant="outline"
                            className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                        >
                            Change Password
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
                                    <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-border hover:bg-accent">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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