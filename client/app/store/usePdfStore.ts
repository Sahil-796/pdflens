import { create } from "zustand";

type PdfState = {
  pdfId: string | null;
  fileName: string;
  htmlContent: string;
  setPdf: (data: Partial<PdfState>) => void;
  clearPdf: () => void;
};

export const usePdfStore = create<PdfState>((set) => ({
  pdfId: null,
  fileName: "Untitled",
  htmlContent: "",
  setPdf: (data) => set((state) => ({ ...state, ...data })),
  clearPdf: () => set({ pdfId: null, fileName: "Untitled", htmlContent: "" }),
}));