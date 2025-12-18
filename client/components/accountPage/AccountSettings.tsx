"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Lock, Settings, User, Sparkles } from "lucide-react";
import ProfileTab from "./profile-tab";
import SecurityTab from "./security-tab";
import BillingTab from "./billing-tab";
import AccountTab from "./account-tab";
import useUser from "@/hooks/useUser";
import LumaSpin from "../21st/LumaSpin";
import { Separator } from "@/components/ui/separator";

const AccountSettings = () => {
  const { loading, user } = useUser();

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LumaSpin />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, subscription, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
            <TabItem value="profile" icon={User} label="Profile" />
            <TabItem value="billing" icon={CreditCard} label="Billing & Plan" />
            {user?.userProvider === "credential" && (
              <TabItem value="security" icon={Lock} label="Security" />
            )}
            <TabItem value="account" icon={Settings} label="General" />
          </TabsList>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:max-w-2xl">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <SectionTitle
              title="Profile"
              description="This is how others will see you on the site."
            />
            <Separator />
            <ProfileTab />
          </TabsContent>

          <TabsContent value="billing" className="mt-0 space-y-6">
            <SectionTitle
              title="Billing"
              description="Manage your subscription and credit usage."
            />
            <Separator />
            <BillingTab />
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-6">
            <SectionTitle
              title="Security"
              description="Update your password and security settings."
            />
            <Separator />
            <SecurityTab />
          </TabsContent>

          <TabsContent value="account" className="mt-0 space-y-6">
            <SectionTitle
              title="General"
              description="Manage account deletion and data."
            />
            <Separator />
            <AccountTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Helper Components
const TabItem = ({ value, icon: Icon, label }: any) => (
  <TabsTrigger
    value={value}
    className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 transition-colors"
  >
    <Icon className="w-4 h-4" />
    {label}
  </TabsTrigger>
);

const SectionTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default AccountSettings;
