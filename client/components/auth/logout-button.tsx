"use client";

import { Button } from "../ui/button";
import { Loader2, LogOut } from "lucide-react";

import { useLogout } from "@/hooks/mutations/useLogout";

const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();
  return (
    <Button
      variant="destructive"
      onClick={() => logout()}
      disabled={isPending}
      className="w-full flex items-center mt-2 gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}

      <span>{isPending ? "Logging out..." : "Logout"}</span>
    </Button>
  );
};

export default LogoutButton;
