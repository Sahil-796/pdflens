'use client'

import useUser from "@/hooks/useUser"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { toast } from "sonner"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Lock } from "lucide-react"

const SecurityTab = () => {
  const { user } = useUser()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)


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

  return (
    <>
      {/* Security Tab */}
      {user?.userProvider === 'credential' ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-1">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>

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
              disabled={!user?.isAuthenticated}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password (min. 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-background border-border focus:ring-primary"
              disabled={!user?.isAuthenticated}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-background border-border focus:ring-primary"
              disabled={!user?.isAuthenticated}
            />
          </div>

          <Button
            onClick={handleChangePassword}
            variant="secondary"
            className="w-full"
            disabled={
              !user?.isAuthenticated ||
              changingPassword ||
              !currentPassword ||
              !newPassword ||
              newPassword !== confirmPassword
            }
          >
            {changingPassword ? "Changing..." : "Update Password"}
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Password settings are not available for social login accounts
          </p>
        </div>
      )}
    </>
  )
}

export default SecurityTab
