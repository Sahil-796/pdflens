'use client'

import { Label } from "@/components/ui/label"
import useUser from "@/hooks/useUser"
import { authClient } from "@/lib/auth-client"
import { User, Dot, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
const ProfileTab = () => {
  const { user } = useUser()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [updatingName, setUpdatingName] = useState(false)
  const [updatingEmail, setUpdatingEmail] = useState(false)

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user?.name, user?.email])


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
  return (
    <>
      {/* Name Update */}
      < div className="space-y-2" >
        <div className="flex items-center gap-1">
          <Label htmlFor="name" className="text-sm font-medium">
            Display Name
          </Label>
          {name !== user?.name && (
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
              disabled={!user?.isAuthenticated}
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleUpdateName}
            className="sm:w-auto w-full cursor-pointer"
            disabled={updatingName || !user?.isAuthenticated}
          >
            {updatingName ? 'Updating...' : 'Change Name'}
          </Button>
        </div>
      </div >

      {/* Email Update */}
      < div className="space-y-2" >
        <div className="flex items-center gap-1">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          {email !== user?.email && (
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
              disabled={user?.userProvider !== 'credential' || !user?.isAuthenticated}
            />
          </div>
          {user?.userProvider === 'credential' && (
            <Button
              variant="secondary"
              onClick={handleUpdateEmail}
              className="sm:w-auto w-full cursor-pointer"
              disabled={updatingEmail || !user?.isAuthenticated}
            >
              {updatingEmail ? 'Updating...' : 'Change Email'}
            </Button>
          )}
        </div>
      </div >
    </>
  )
}

export default ProfileTab
