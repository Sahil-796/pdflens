import { create } from "zustand";

interface EditorState {
  // --- Document State (The "Draft") ---
  activePdfId: string | null;
  fileName: string;
  draftHtml: string; // The HTML currently being edited/viewed
  isDirty: boolean; // Has the user made unsaved changes?

  // --- Context/RAG State ---
  contextFiles: string[]; // Files uploaded in Generate page
  isContext: boolean; // Does the active PDF have context attached?

  // --- UI State ---
  isSidebarOpen: boolean;

  // --- AI & Selection State (From EditPdfStore) ---
  status: "idle" | "loading" | "aiResult" | "prompt";
  promptValue: string;
  selectedId: string; // ID of the clicked HTML element
  selectedText: string; // Text content of the selected element
  originalElementHtml: string; // The specific element HTML before AI edit
  aiResponse: string; // The text suggested by AI
  showAiResponse: boolean; // Is the "Accept/Reject" box visible?

  // --- Actions ---
  // Initialization & Reset
  initializeEditor: (data: {
    id: string;
    fileName: string;
    html: string;
    isContext: boolean;
  }) => void;
  resetEditor: () => void;

  // Document Actions
  updateDraftHtml: (html: string) => void;
  updateFileName: (name: string) => void;
  setContextFiles: (files: string[]) => void;
  setIsContext: (isContext: boolean) => void;

  // UI Actions
  toggleSidebar: (isOpen?: boolean) => void;

  // AI & Selection Actions
  selectElement: (id: string, text: string, outerHtml: string) => void;
  clearSelection: () => void;
  setPromptValue: (val: string) => void;
  setAiStatus: (status: EditorState["status"]) => void;
  setAiResponse: (response: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  // --- Initial State ---
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

  // --- Actions ---

  // 1. Called when entering the Edit Page or finishing Generation
  initializeEditor: ({ id, fileName, html, isContext = false }) =>
    set({
      activePdfId: id,
      fileName,
      draftHtml: html,
      isContext,
      // Reset interaction state
      status: "prompt",
      isDirty: false,
      selectedId: "",
      selectedText: "",
      showAiResponse: false,
    }),

  // 2. Cleanup when leaving pages
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

  // 3. Document Updates
  updateDraftHtml: (html) =>
    set({
      draftHtml: html,
      isDirty: true,
    }),

  updateFileName: (name) => set({ fileName: name }),

  setContextFiles: (files) => set({ contextFiles: files }),

  setIsContext: (isContext) => set({ isContext }),

  // 4. UI Updates
  toggleSidebar: (isOpen) =>
    set((state) => ({
      isSidebarOpen: isOpen ?? !state.isSidebarOpen,
    })),

  // 5. Selection & AI Logic
  selectElement: (id, text, outerHtml) =>
    set({
      selectedId: id,
      selectedText: text,
      originalElementHtml: outerHtml,
      // When selecting new text, reset AI status
      status: "prompt",
      showAiResponse: false,
      promptValue: "", // Optional: clear prompt on new selection
      isSidebarOpen: true, // Auto-open sidebar on mobile
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
      // Auto-show response box if status becomes 'aiResult'
      showAiResponse: status === "aiResult",
    }),

  setAiResponse: (response) => set({ aiResponse: response }),
}));
