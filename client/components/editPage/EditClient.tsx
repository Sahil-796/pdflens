"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Dot } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import EditPDF from "./EditPDF";
import PDFPreview from "@/components/editPage/PDFPreview";
import DownloadPDF from "@/components/editPage/DownloadPDF";
import DownloadAsWord from "./DownlodAsWord";
import SaveChanges from "./SaveChanges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePdfDetail } from "@/hooks/mutations/usePdfDetail";

export default function EditClient({ id }: { id: string }) {
  const router = useRouter();

  const { data: serverPdf, isLoading, isError } = usePdfDetail(id);

  const {
    initializeEditor,
    updateFileName,
    fileName,
    draftHtml,
    isSidebarOpen,
    toggleSidebar,
    resetEditor,
    contextFiles,
    isContext,
  } = useEditorStore();

  useEffect(() => {
    if (serverPdf && serverPdf.id === id) {
      initializeEditor({
        id: serverPdf.id,
        fileName: serverPdf.fileName,
        html: serverPdf.htmlContent || "",
        isContext: isContext,
      });
    }

    return () => resetEditor();
  }, [serverPdf, id, initializeEditor, resetEditor, isContext]);

  if (isError) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Mobile Toggle Button */}
      <Button
        variant="secondary"
        onClick={() => toggleSidebar()}
        className={`lg:hidden fixed bottom-4 left-4 z-20 p-3 rounded-full transition-all`}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => toggleSidebar(false)}
        />
      )}

      {/* Left Panel - Edit Tools (Restored Logic) */}
      <div
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:relative
        left-0 lg:left-auto
        w-90 max-w-[85vw] lg:max-w-none
        h-[calc(100%-var(--header-height,0px))]
        lg:h-full
        border-r border-border bg-card
        flex flex-col
        transition-transform duration-300 ease-in-out
        z-40
        overflow-hidden
      `}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <EditPDF pdfId={id} onSidebarToggle={() => toggleSidebar()} />
        </div>

        {/* Context Files Section (Restored UI) */}
        <div className="p-4 mb-8 lg:mb-4 border-t border-border shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Context Files
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {contextFiles.length}
            </span>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
              </div>
            ) : contextFiles.length > 0 ? (
              <ul className="space-y-1">
                {contextFiles.map((file, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground truncate px-2 py-1 rounded bg-muted/50"
                  >
                    {file}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No context files</p>
            )}
          </div>
        </div>
      </div>

      {/* Main PDF View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label
                htmlFor="filename"
                className="text-sm font-medium text-muted-foreground whitespace-nowrap"
              >
                File Name:
              </label>
              <div className="relative flex items-center">
                <Input
                  id="filename"
                  value={fileName}
                  disabled={isLoading}
                  onChange={(e) => updateFileName(e.target.value)}
                  className="font-medium text-sm w-64"
                />
                {/* Show dot if modified from server version */}
                {serverPdf?.fileName !== fileName && (
                  <Dot className="text-primary scale-200 animate-caret-blink" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Using Smart Components (No props needed!) */}
              <SaveChanges />
              <DownloadPDF />
              <DownloadAsWord />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={fileName}
                onChange={(e) => updateFileName(e.target.value)}
                className="font-medium text-sm w-full"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <SaveChanges />
              <DownloadPDF />
            </div>
          </div>
        </div>

        {/* PDF Preview Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 h-full overflow-hidden"
        >
          <PDFPreview
            loading={isLoading || !draftHtml}
            html={draftHtml}
            pdfId={id}
            onTextSelect={() => toggleSidebar(true)}
          />
        </motion.div>
      </div>
    </div>
  );
}
