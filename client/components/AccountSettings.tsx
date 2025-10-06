'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Mail, User } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { toast } from "sonner"
import useUser from "@/hooks/useUser"

const AccountSettings = () => {
    const { user, loading } = useUser()
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [updating, setUpdating] = useState(false)

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true)
            // Add your update profile API call here
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error('Failed to update profile')
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
        return <div>Loading...</div>
    }

    return (
        <div className='h-full w-full max-w-3xl mx-auto p-6 space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your account settings and set email preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Verification Status */}
                        {user ? (
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
                            className="w-full"
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </div>

                    <Separator />

                    {/* Password Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Password</h3>
                        <Button variant="outline" className="w-full">
                            Change Password
                        </Button>
                    </div>

                    <Separator />

                    {/* Danger Zone */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive hover:bg-destructive/90"
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