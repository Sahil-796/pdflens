import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userKeys, pdfKeys } from "@/lib/queryKeys";
import { useEditorStore } from "@/store/useEditorStore";

export function useGeneratePdf() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { initializeEditor, updateDraftHtml } = useEditorStore();

  return useMutation({
    mutationFn: async (payload: {
      userPrompt: string;
      fileName: string;
      isContext: boolean;
      pdfId?: string; // <--- ADDED THIS
    }) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error("DAILY TOKEN LIMIT REACHED");
        throw new Error("PDF Generation failed");
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      // 1. Update User Credits
      queryClient.setQueryData(userKeys.profile(), (oldUser: any) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          creditsLeft: data.creditsLeft,
        };
      });

      queryClient.invalidateQueries({ queryKey: pdfKeys.lists() });

      // 2. Handle "Editor Mode" vs "Dashboard Mode"
      if (variables.pdfId) {
        // We are RE-generating inside the editor.
        // Just update the HTML, don't force a reload/redirect.
        updateDraftHtml(data.data);
        toast.success("Content Regenerated!");
      } else {
        // We are creating a NEW document from the dashboard.
        // Initialize and Redirect.
        initializeEditor({
          id: data.pdfId,
          fileName: data.fileName,
          html: data.data,
          isContext: variables.isContext,
        });
        toast.success(`"${data.fileName}" Generated Successfully!`);
        router.push(`/edit/${data.pdfId}`);
      }
    },
    onError: (error: Error) => {
      if (error.message !== "DAILY TOKEN LIMIT REACHED") {
        console.error(error);
        toast.error("Failed to generate PDF");
      }
    },
  });
}
