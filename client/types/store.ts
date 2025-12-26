export interface EditorState {
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
