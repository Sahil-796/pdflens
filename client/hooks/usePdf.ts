import { useEffect, useState } from "react";
import { usePdfStore } from "@/app/store/usePdfStore";
import { toast } from "sonner";

interface Pdf {
  id: string;
  fileName: string;
  createdAt: string | null;
  htmlContent: string;
}

export function usePdf(initialLimit?: number) {
  const { pdfs, loading, status, setPdfs, removePdf, setLoading, setStatus } =
    usePdfStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPdfs = async () => {
      if (status !== "idle") return;

      try {
        setLoading(true);
        setStatus("loading");
        const res = await fetch("/api/getALL");
        const data = await res.json();
        setPdfs(data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setStatus("error");
        toast.error("Failed to fetch PDFs");
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, [setPdfs, setLoading, setStatus, status]);

  const handleDelete = async (pdfId: string, pdfName?: string) => {
    try {
      const res = await fetch("/api/deletePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete PDF");
      }

      removePdf(pdfId);
      if (pdfName) toast.success(`${pdfName} deleted`);
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete PDF");
    }
  };

  const handleViewMore = () => setShowAll(true);

  const displayedPdfs =
    showAll || !initialLimit ? pdfs : pdfs.slice(0, initialLimit);

  return {
    pdfs: displayedPdfs,
    totalCount: pdfs.length,
    loading,
    status,
    handleDelete,
    handleViewMore,
    showAll,
  };
}
