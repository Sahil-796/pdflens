import { create } from "zustand";

interface EditorState {
  activePdfId: string | null;
  fileName: string;
  draftHtml: string;
  isDirty: boolean;

  contextFiles: string[];
  isContext: boolean;

  isSidebarOpen: boolean;

  status: "idle" | "loading" | "aiResult" | "prompt";
  promptValue: string;
  selectedId: string;
  selectedText: string;
  originalElementHtml: string;
  aiResponse: string;
  showAiResponse: boolean;

  initializeEditor: (data: {
    id: string;
    fileName: string;
    html: string;
    isContext: boolean;
  }) => void;
  resetEditor: () => void;

  updateDraftHtml: (html: string) => void;
  updateFileName: (name: string) => void;
  setContextFiles: (files: string[]) => void;
  setIsContext: (isContext: boolean) => void;

  toggleSidebar: (isOpen?: boolean) => void;

  selectElement: (id: string, text: string, outerHtml: string) => void;
  clearSelection: () => void;
  setPromptValue: (val: string) => void;
  setAiStatus: (status: EditorState["status"]) => void;
  setAiResponse: (response: string) => void;
}

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
