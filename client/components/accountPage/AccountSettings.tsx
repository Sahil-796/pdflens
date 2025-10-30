'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Lock, Settings, User } from "lucide-react"
import AccountHeader from "./account-header"
import ProfileTab from "./profile-tab"
import SecurityTab from "./security-tab"
import BillingTab from "./billing-tab"
import AccountTab from "./account-tab"
import useUser from "@/hooks/useUser"
import LumaSpin from "../21st/LumaSpin"

const AccountSettings = () => {

  const { loading } = useUser()

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LumaSpin />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto my-auto p-6">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-2">
          <AccountHeader />
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityTab />
            </TabsContent>


            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <BillingTab />
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <AccountTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountSettings
