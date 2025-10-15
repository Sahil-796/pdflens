import { create } from "zustand";

interface Pdf {
  id: string;
  fileName: string;
  createdAt: string | null;
  htmlContent: string;
}

interface PdfState {
  status: 'idle' | 'loading' | 'error' | 'success';
  setStatus: (status: 'idle' | 'loading' | 'error' | 'success') => void;
  pdfs: Pdf[];
  setPdfs: (pdfs: Pdf[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  addPdf: (pdf: Pdf) => void;
  removePdf: (id: string) => void;
  pdfId: string | null;
  fileName: string;
  htmlContent: string;
  isContext: boolean;
  setPdf: (data: Partial<PdfState>) => void;
  clearPdf: () => void;
};

export const usePdfStore = create<PdfState>(set => ({
  status: 'idle',
  setStatus: (status) => set({ status }),
  pdfs: [],
  setPdfs: (pdfs) => set({ pdfs }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  addPdf: (pdf) => set((state) => ({
    pdfs: [pdf, ...state.pdfs],
  })),
  removePdf: (id) => set((state) => ({
    pdfs: state.pdfs.filter((pdf) => pdf.id !== id)
  })),
  pdfId: null,
  fileName: "Untitled",
  htmlContent: "",
  isContext: false,
  setPdf: (data) => set((state) => ({ ...state, ...data })),
  clearPdf: () => set({ pdfId: null, fileName: "Untitled", htmlContent: "", isContext: false }),
}));
