import { create } from "zustand";

import { EditorState } from "@/types/store";

export const useEditorStore = create<EditorState>((set) => ({
  activePdfId: null,
  fileName: "Untitled",
  draftHtml: "",
  isDirty: false,

  contextFiles: [],
  isContext: false,

  isSidebarOpen: false,

  status: "idle",
  promptValue: "",
  selectedId: "",
  selectedText: "",
  originalElementHtml: "",
  aiResponse: "",
  showAiResponse: false,

  initializeEditor: ({ id, fileName, html, isContext = false }) =>
    set({
      activePdfId: id,
      fileName,
      draftHtml: html,
      isContext,
      status: "prompt",
      isDirty: false,
      selectedId: "",
      selectedText: "",
      showAiResponse: false,
    }),

  resetEditor: () =>
    set({
      activePdfId: null,
      fileName: "Untitled",
      draftHtml: "",
      isDirty: false,
      contextFiles: [],
      isContext: false,
      status: "idle",
      promptValue: "",
      selectedId: "",
      selectedText: "",
      aiResponse: "",
      showAiResponse: false,
      isSidebarOpen: false,
    }),

  updateDraftHtml: (html) =>
    set({
      draftHtml: html,
      isDirty: true,
    }),

  updateFileName: (name) => set({ fileName: name }),

  setContextFiles: (files) => set({ contextFiles: files }),

  setIsContext: (isContext) => set({ isContext }),

  toggleSidebar: (isOpen) =>
    set((state) => ({
      isSidebarOpen: isOpen ?? !state.isSidebarOpen,
    })),

  selectElement: (id, text, outerHtml) =>
    set({
      selectedId: id,
      selectedText: text,
      originalElementHtml: outerHtml,
      status: "prompt",
      showAiResponse: false,
      promptValue: "",
      isSidebarOpen: true,
    }),

  clearSelection: () =>
    set({
      selectedId: "",
      selectedText: "",
      originalElementHtml: "",
      promptValue: "",
      showAiResponse: false,
      status: "prompt",
    }),

  setPromptValue: (val) => set({ promptValue: val }),

  setAiStatus: (status) =>
    set({
      status,
      showAiResponse: status === "aiResult",
    }),

  setAiResponse: (response) => set({ aiResponse: response }),
}));
