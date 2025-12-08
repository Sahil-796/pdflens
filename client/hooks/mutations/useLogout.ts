import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEditorStore } from "@/store/useEditorStore";
import { queryClient } from "@/lib/queryClient";

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      useEditorStore.getState().resetEditor();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout failed", error);
      toast.error("Failed to logout");
    },
  });
}
