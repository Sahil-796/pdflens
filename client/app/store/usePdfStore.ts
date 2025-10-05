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
    status: 'idle' | 'loading' | 'error' | 'success';
    setPdfs: (pdfs: Pdf[]) => void;
    addPdf: (pdf: Pdf) => void;
    removePdf: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setStatus: (status: 'idle' | 'loading' | 'error' | 'success') => void;
    renderedHtml: string;
    setRenderedHtml: (html: string) => void;
    selectedId: string;
    setSelectedId: (text: string) => void;
    selectedText: string;
    setSelectedText: (text: string) => void;
    originalHtml: string;
    setOriginalHtml: (html: string) => void;
    pdfId: string | null;
    fileName: string;
    htmlContent: string;
    isContext: boolean;
    aiResponse: string;
    setAiResponse: (response: string) => void;
    showAiResponse: boolean;
    setShowAiResponse: (show: boolean) => void;
    setPdf: (data: Partial<PdfState>) => void;
    clearPdf: () => void;
};

export const usePdfStore = create<PdfState>(set => ({
  pdfs: [],
  loading: false,
  status: 'idle',
  setPdfs: (pdfs) => set({ pdfs, status: 'success' }),
  addPdf: (pdf) => set((state) => ({ 
      pdfs: [...state.pdfs, pdf],
  })),
  removePdf: (id) => set((state) => ({ 
      pdfs: state.pdfs.filter((pdf) => pdf.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
  setStatus: (status) => set({ status }),
  renderedHtml: '',
  setRenderedHtml: (html) => set({ renderedHtml: html }),
  selectedId: '',
  setSelectedId: (text) => set({ selectedId: text }),
  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),
  originalHtml: '',
  setOriginalHtml: (html) => set({ originalHtml: html }),
  pdfId: null,
  fileName: "Untitled",
  htmlContent: "",
  isContext: false,
  aiResponse: '',
  setAiResponse: (response) => set({ aiResponse: response }),
  showAiResponse: false,
  setShowAiResponse: (show) => set({ showAiResponse: show }),
  setPdf: (data) => set((state) => ({ ...state, ...data })),
  clearPdf: () => set({ pdfId: null, fileName: "Untitled", htmlContent: "", isContext: false, selectedText: '', selectedId: '', renderedHtml: '', originalHtml: '', aiResponse: '', showAiResponse: false }),
}));