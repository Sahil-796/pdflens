"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "sonner";

interface PDFPreviewProps {
  loading: boolean;
  html?: string;
  pdfId: string;
  onTextSelect?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ loading, onTextSelect }) => {
  const {
    draftHtml,
    updateDraftHtml,
    selectedId,
    selectElement,
    clearSelection,
    aiResponse,
    showAiResponse,
    setAiStatus,
    setAiResponse,
  } = useEditorStore();

  const previewNodeRef = useRef<HTMLElement | null>(null);

  const cleanAiOutput = (raw: string) => {
    return raw
      .replace(/^```html/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
  };

  const handleAccept = useCallback(() => {
    if (!selectedId || !previewNodeRef.current) return;

    const finalHtml = previewNodeRef.current.outerHTML;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = finalHtml;
    const cleanEl = tempDiv.firstElementChild;
    if (cleanEl) {
      cleanEl.classList.remove("preview-mode", "selected");
      cleanEl.removeAttribute("style");
      cleanEl.id = selectedId;
    }

    const cleanContent = tempDiv.innerHTML;

    const parser = new DOMParser();
    const doc = parser.parseFromString(draftHtml, "text/html");
    const originalEl = doc.getElementById(selectedId);

    if (originalEl) {
      originalEl.outerHTML = cleanContent;
      updateDraftHtml(doc.documentElement.outerHTML);
      toast.success("Changes applied");
    }

    setAiResponse("");
    setAiStatus("prompt");
    clearSelection();

    previewNodeRef.current?.remove();
    previewNodeRef.current = null;
  }, [
    selectedId,
    draftHtml,
    updateDraftHtml,
    setAiResponse,
    setAiStatus,
    clearSelection,
  ]);

  const handleReject = useCallback(() => {
    if (!selectedId) return;

    setAiResponse("");
    setAiStatus("prompt");

    const parser = new DOMParser();
    const doc = parser.parseFromString(draftHtml, "text/html");
    const el = doc.getElementById(selectedId);
    if (el) el.classList.remove("selected");

    updateDraftHtml(doc.documentElement.outerHTML);
  }, [selectedId, draftHtml, updateDraftHtml, setAiResponse, setAiStatus]);

  useEffect(() => {
    const previouslySelected = document.querySelectorAll(".selected");
    previouslySelected.forEach((el) => el.classList.remove("selected"));

    if (selectedId) {
      const targetEl = document.getElementById(selectedId);
      if (targetEl) {
        targetEl.classList.add("selected");
      }
    }
  }, [selectedId, draftHtml]);

  useEffect(() => {
    if (!showAiResponse || !selectedId || !aiResponse) {
      if (previewNodeRef.current) {
        previewNodeRef.current.remove();
        previewNodeRef.current = null;
      }
      const original = document.getElementById(selectedId);
      if (original) original.style.display = "";
      return;
    }

    const originalEl = document.getElementById(selectedId);
    if (!originalEl) return;

    if (previewNodeRef.current && document.contains(previewNodeRef.current))
      return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanAiOutput(aiResponse);
    const newEl = tempDiv.firstElementChild as HTMLElement;

    if (!newEl) return;

    newEl.classList.add("preview-mode");
    newEl.id = `${selectedId}-preview`;

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "block";

    wrapper.appendChild(newEl);

    const toolbar = document.createElement("div");
    toolbar.className =
      "ai-action-toolbar absolute z-50 flex gap-2 mt-2 bg-background border border-border shadow-lg rounded-md p-1.5";
    toolbar.style.bottom = "-45px";
    toolbar.style.right = "0px";
    toolbar.style.whiteSpace = "nowrap";

    toolbar.innerHTML = `
      <button id="btn-accept" class="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs font-medium rounded transition cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Accept
      </button>
      <button id="btn-reject" class="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs font-medium rounded transition cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        Reject
      </button>
    `;
    wrapper.appendChild(toolbar);

    originalEl.insertAdjacentElement("afterend", wrapper);
    originalEl.style.display = "none";

    previewNodeRef.current = wrapper;

    const acceptBtn = toolbar.querySelector("#btn-accept");
    const rejectBtn = toolbar.querySelector("#btn-reject");

    const onAccept = (e: Event) => {
      e.stopPropagation();
      handleAccept();
    };
    const onReject = (e: Event) => {
      e.stopPropagation();
      handleReject();
    };

    acceptBtn?.addEventListener("click", onAccept);
    rejectBtn?.addEventListener("click", onReject);

    return () => {
      acceptBtn?.removeEventListener("click", onAccept);
      rejectBtn?.removeEventListener("click", onReject);
      if (wrapper && wrapper.parentNode) {
        wrapper.remove();
      }
      if (originalEl) {
        originalEl.style.display = "";
      }
      previewNodeRef.current = null;
    };
  }, [showAiResponse, selectedId, aiResponse, handleAccept, handleReject]);

  const handlePdfClick = (e: React.MouseEvent) => {
    if (showAiResponse) {
      toast.info("Please Accept or Reject the AI suggestion first.");
      return;
    }

    const target = (e.target as HTMLElement).closest(
      ".selectable",
    ) as HTMLElement | null;

    if (!target || target.id === "pdf-root" || target.tagName === "BODY")
      return;

    if (!target.id)
      target.id = `gen-${Math.random().toString(36).substr(2, 9)}`;

    if (selectedId === target.id) {
      clearSelection();
    } else {
      selectElement(target.id, target.innerText, target.outerHTML);
      if (onTextSelect) onTextSelect();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      id="pdf-root"
      className="h-full w-full bg-white p-8 overflow-y-auto shadow-sm text-black"
      dangerouslySetInnerHTML={{ __html: draftHtml }}
      onMouseOver={(e) => {
        if (showAiResponse) return;
        const target = (e.target as HTMLElement).closest(
          ".selectable",
        ) as HTMLElement | null;
        if (target) target.classList.add("hovered");
      }}
      onMouseOut={(e) => {
        const target = (e.target as HTMLElement).closest(
          ".selectable",
        ) as HTMLElement | null;
        if (target) target.classList.remove("hovered");
      }}
      onClick={handlePdfClick}
      style={{ cursor: showAiResponse ? "default" : "text" }}
    />
  );
};

export default PDFPreview;
