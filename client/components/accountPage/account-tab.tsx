"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { queryClient } from "@/lib/queryClient";
import { useEditorStore } from "@/store/useEditorStore";

const AccountTab = () => {
  const router = useRouter();

  const [confirmText, setConfirmText] = useState("");
  const [, setDeleteLoading] = useState(false);
  const handleDeleteAccount = async () => {
    if (confirmText.trim().toLowerCase() !== "delete my account") {
      toast.error("Confirmation text incorrect.");
      return;
    }
    try {
      setDeleteLoading(true);
      await authClient.deleteUser();
      queryClient.clear();
      useEditorStore.getState().resetEditor();

      toast.success("Account deleted!");
      router.push("/goodbye");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          Account Management
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full cursor-pointer">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-card border border-border rounded-xl max-w-sm mx-auto">
              <AlertDialogHeader className="text-center space-y-2">
                <AlertDialogTitle className="text-lg font-semibold text-foreground">
                  Confirm Account Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  This action{" "}
                  <span className="font-semibold text-destructive">
                    cannot be undone
                  </span>
                  . Type{" "}
                  <span className="font-medium text-destructive">
                    &quot;delete my account&quot;
                  </span>{" "}
                  below to confirm.
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
                  disabled={
                    confirmText.trim().toLowerCase() !== "delete my account"
                  }
                  className="px-3 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default AccountTab;
