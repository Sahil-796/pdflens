'use client'
import { ArrowRightCircle, Coins } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Badge } from "@/components/ui/badge"
import useUser from "@/hooks/useUser"
import { useUserStore } from "@/app/store/useUserStore"
import { useRouter } from "next/navigation"

const BillingTab = () => {

  const { user } = useUser()
  const { creditsLeft } = useUserStore()
  const router = useRouter()
  return (
    <>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Credits & Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your credits and subscription
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
            <p className="text-2xl font-bold text-foreground">{creditsLeft}</p>
          </div>
        </div>
        {!user?.isPro && (
          <Badge variant="outline" className="text-xs">Free Plan</Badge>
        )}
      </div>

      {!user?.isPro && (
        <div className="p-6 border border-primary/20 rounded-lg bg-primary/5">
          <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get unlimited credits and access to premium features
          </p>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            onClick={() => router.push("/pricing")}
          >
            View Plans
            <ArrowRightCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Separator className="bg-border" />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Usage History</h3>
        <div className="p-4 border border-border rounded-lg bg-muted/10">
          <p className="text-sm text-muted-foreground text-center">Coming soon...</p>
        </div>
      </div>
    </>
  )
}

export default BillingTab
