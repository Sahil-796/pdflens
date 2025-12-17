import { useQuery } from "@tanstack/react-query";
import { pdfKeys } from "@/lib/queryKeys";

export function usePdfDetail(id: string) {
  return useQuery({
    queryKey: pdfKeys.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/pdfs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch PDF");
      const data = await res.json();
      return data.pdf;
    },
    // Optional: Poll every 2s if status is 'processing'
    refetchInterval: (data) => (data?.status === "processing" ? 2000 : false),
  });
}
