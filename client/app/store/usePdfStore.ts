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
  setPdf: (data: Partial<PdfState>) => void;
  clearPdf: () => void;
};

export const usePdfStore = create<PdfState>((set) => ({
  renderedHtml: '',
  setRenderedHtml: (html) => set({ renderedHtml: html }),
  selectedId: '',
  setSelectedId: (text) => set({ selectedId: text }),
  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),
  originalHtml: '',
  setOriginalHtml: (html) => set({ originalHtml: html }),
  pdfId: null,
  fileName: "",
  htmlContent: "",
  isContext: false,
  setPdf: (data) => set((state) => ({ ...state, ...data })),
  clearPdf: () => set({ pdfId: null, fileName: "Untitled", htmlContent: ""}),
}));