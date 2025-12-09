import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEditorStore } from "@/store/useEditorStore";
import { userKeys } from "@/lib/queryKeys";

export function useAiEdit() {
  const queryClient = useQueryClient();

  const {
    setAiStatus,
    setAiResponse,
    originalElementHtml,
    promptValue,
    isContext,
  } = useEditorStore();

  return useMutation({
    mutationFn: async ({ pdfId }: { pdfId: string }) => {
      const res = await fetch("/api/editHTML", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: promptValue,
          html: originalElementHtml,
          pdfId,
          isContext: isContext,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error("DAILY TOKEN LIMIT REACHED");
        throw new Error("AI Edit failed");
      }
      return res.json();
    },

    onMutate: () => {
      setAiStatus("loading");
    },

    onSuccess: (data) => {
      setAiResponse(data.data);
      setAiStatus("aiResult");

      queryClient.setQueryData(userKeys.profile(), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          creditsLeft: data.creditsLeft,
        };
      });

      toast.success("AI Suggestion Ready");
    },

    onError: (error: Error) => {
      console.error(error);
      setAiStatus("prompt");

      if (error.message === "DAILY TOKEN LIMIT REACHED") {
        toast.error("You have run out of credits!");
      } else {
        toast.error("Failed to generate AI response");
      }
    },
  });
}
