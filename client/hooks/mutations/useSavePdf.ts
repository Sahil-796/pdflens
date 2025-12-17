import { pdfKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSavePdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      html,
      fileName,
    }: {
      id: string;
      html: string;
      fileName: string;
    }) => {
      const res = await fetch(`/api/pdfs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, filename: fileName }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pdfKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: pdfKeys.lists() });
      toast.success("Changes saved");
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
  });
}
