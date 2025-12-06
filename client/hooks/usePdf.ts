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

        const TWO_MINS = 2 * 60 * 1000;
        const now = Date.now();
        const invalidPdfs = data.filter((pdf: Pdf) => {
          if (!pdf.createdAt) return false;
          const createdTime = new Date(pdf.createdAt).getTime();
          const isOlderThan2 = now - createdTime > TWO_MINS;
          return pdf.htmlContent === "" && isOlderThan2;
        });
        if (invalidPdfs.length > 0) {
          invalidPdfs.map((pdf: Pdf) => {
            handleDelete(pdf.id);
          });
        }
        const validPdfs = data.filter((pdf: Pdf) => !invalidPdfs.includes(pdf));

        setPdfs(validPdfs);
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
