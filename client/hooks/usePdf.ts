import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pdfKeys } from "@/lib/queryKeys";

interface Pdf {
  id: string;
  fileName: string;
  createdAt: string | null;
  htmlContent: string;
}

export function usePdf(initialLimit: number = 8) {
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);

  const {
    data: pdfs = [],
    isLoading: loading,
    isError,
  } = useQuery<Pdf[]>({
    queryKey: pdfKeys.lists(),
    queryFn: async () => {
      const res = await fetch("/api/getALL");
      if (!res.ok) throw new Error("Failed to fetch PDFs");
      return res.json();
    },
    staleTime: 60 * 1000,
  });
  const deleteMutation = useMutation({
    mutationFn: async (pdfId: string) => {
      const res = await fetch("/api/deletePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId }),
      });
      if (!res.ok) throw new Error("Failed to delete PDF");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pdfKeys.lists() });
      toast.success("PDF deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete PDF");
    },
  });

  const handleDelete = (pdfId: string) => {
    deleteMutation.mutate(pdfId);
  };

  const handleViewMore = () => setShowAll(true);
  const displayedPdfs =
    showAll || !initialLimit ? pdfs : pdfs.slice(0, initialLimit);

  return {
    pdfs: displayedPdfs,
    totalCount: pdfs.length,
    loading,
    status: isError ? "error" : loading ? "loading" : "idle",
    handleDelete,
    handleViewMore,
    showAll,
    isDeleting: deleteMutation.isPending,
  };
}
