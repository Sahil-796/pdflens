import { create } from "zustand";

interface Pdf {
  id: string;
  fileName: string;
  createdAt: string | null;
  htmlContent: string;
}

interface PdfState {
  pdfs: Pdf[];
  loading: boolean;
  setPdfs: (pdfs: Pdf[]) => void;
  addPdf: (pdf: Pdf) => void;
  removePdf: (id: string) => void;
  setLoading: (loading: boolean) => void;
  pdfId: string | null;
  fileName: string;
  htmlContent: string;
  isContext: boolean;
  setPdf: (data: Partial<PdfState>) => void;
  clearPdf: () => void;
};

export const usePdfStore = create<PdfState>(set => ({
  pdfs: [],
  loading: false,
  setPdfs: (pdfs) => set({ pdfs }),
  addPdf: (pdf) => set((state) => ({
    pdfs: [...state.pdfs, pdf],
  })),
  removePdf: (id) => set((state) => ({
    pdfs: state.pdfs.filter((pdf) => pdf.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
  pdfId: null,
  fileName: "Untitled",
  htmlContent: "",
  isContext: false,
  setPdf: (data) => set((state) => ({ ...state, ...data })),
  clearPdf: () => set({ pdfId: null, fileName: "Untitled", htmlContent: "", isContext: false }),
}));
