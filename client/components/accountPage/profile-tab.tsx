"use client";

import { Label } from "@/components/ui/label";
import useUser from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const ProfileTab = () => {
  const { user } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      if (name.trim() === user?.name) return;
      await authClient.updateUser({ name: name.trim() });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9"
              placeholder="Your Name"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This is your public display name.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={email} disabled={true} className="pl-9 bg-muted/50" />
          </div>
          <p className="text-xs text-muted-foreground">
            Contact support to change your email.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleUpdateName}
          disabled={loading || name === user?.name}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
