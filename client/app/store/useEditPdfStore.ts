import { create } from 'zustand';

interface EditPdfState {
  promptValue: string;
  setPromptValue: (text: string) => void;
  status: 'aiResult' | 'prompt' | 'loading';
  setStatus: (status: 'prompt' | 'loading' | 'aiResult') => void;
  renderedHtml: string;
  setRenderedHtml: (html: string) => void;
  selectedId: string;
  setSelectedId: (text: string) => void;
  selectedText: string;
  setSelectedText: (text: string) => void;
  originalHtml: string;
  setOriginalHtml: (html: string) => void;
  aiResponse: string;
  setAiResponse: (response: string) => void;
  showAiResponse: boolean;
  setShowAiResponse: (show: boolean) => void;
}

export const useEditPdfStore = create<EditPdfState>(set => ({
  promptValue: '',
  setPromptValue: (text) => set({ promptValue: text }),
  status: 'prompt',
  setStatus: (status) => set({ status }),
  renderedHtml: '',
  setRenderedHtml: (html) => set({ renderedHtml: html }),
  selectedId: '',
  setSelectedId: (text) => set({ selectedId: text }),
  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),
  originalHtml: '',
  setOriginalHtml: (html) => set({ originalHtml: html }),
  aiResponse: '',
  setAiResponse: (response) => set({ aiResponse: response }),
  showAiResponse: false,
  setShowAiResponse: (show) => set({ showAiResponse: show }),
  clearEditPdf: () => set({ status: 'prompt', renderedHtml: '', selectedId: '', selectedText: '', originalHtml: '', aiResponse: '', showAiResponse: false })
}))
