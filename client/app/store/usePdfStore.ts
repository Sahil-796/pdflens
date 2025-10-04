import { create } from "zustand";

type PdfState = {
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