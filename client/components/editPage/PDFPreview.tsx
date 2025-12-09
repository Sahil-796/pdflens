"use client";

import React, { useEffect, useCallback } from "react";
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

  const handleAccept = useCallback(() => {
    if (!selectedId || !draftHtml || !aiResponse) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(draftHtml, "text/html");
    const el = doc.getElementById(selectedId);

    if (el) {
      el.outerHTML = aiResponse;
      updateDraftHtml(doc.documentElement.outerHTML);
      setAiResponse("");
      setAiStatus("prompt");
      clearSelection();
      toast.success("Changes applied");
    }
  }, [
    draftHtml,
    selectedId,
    aiResponse,
    updateDraftHtml,
    setAiResponse,
    setAiStatus,
    clearSelection,
  ]);

  const handleReject = useCallback(() => {
    setAiResponse("");
    setAiStatus("prompt");

    const parser = new DOMParser();
    const doc = parser.parseFromString(draftHtml, "text/html");
    updateDraftHtml(doc.documentElement.outerHTML);
  }, [draftHtml, setAiResponse, setAiStatus, updateDraftHtml]);

  useEffect(() => {
    if (!showAiResponse || !selectedId || !aiResponse) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(selectedId);
      if (!el) return;

      if (el.querySelector(".ai-response-container")) return;

      const overlay = document.createElement("div");
      overlay.className =
        "ai-response-container mt-2 p-3 bg-green-50 border border-green-200 rounded-md shadow-sm z-50 relative";
      overlay.innerHTML = `
        <div class="ai-suggestion mb-2 text-sm text-green-800">
           <strong>AI Suggestion:</strong> <br/>
           ${aiResponse}
        </div>
        <div class="flex gap-2">
           <button class="accept-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded transition">Accept</button>
           <button class="reject-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded transition">Reject</button>
        </div>
      `;

      el.appendChild(overlay);

      el.querySelector(".accept-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        handleAccept();
      });
      el.querySelector(".reject-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        handleReject();
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [showAiResponse, selectedId, aiResponse, handleAccept, handleReject]);

  const handlePdfClick = (e: React.MouseEvent) => {
    if (showAiResponse) {
      toast.info("Accept or reject the current changes.");
      return;
    }

    const target = (e.target as HTMLElement).closest(
      ".selectable",
    ) as HTMLElement | null;

    if (!target || target.id === "pdf-root" || target.tagName === "BODY")
      return;

    if (!target.id)
      target.id = `gen-${Math.random().toString(36).substr(2, 9)}`;

    const parser = new DOMParser();
    const doc = parser.parseFromString(draftHtml, "text/html");

    if (selectedId === target.id) {
      const el = doc.getElementById(target.id);
      if (el) el.classList.remove("selected");

      updateDraftHtml(doc.documentElement.outerHTML);
      clearSelection();
    } else {
      if (selectedId) {
        const prevEl = doc.getElementById(selectedId);
        if (prevEl) prevEl.classList.remove("selected");
      }

      const el = doc.getElementById(target.id);
      if (el) {
        el.classList.add("selected");
        updateDraftHtml(doc.documentElement.outerHTML);

        selectElement(target.id, target.innerText, target.outerHTML);

        if (onTextSelect) {
          onTextSelect();
        }
      }
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
      style={{ cursor: "text" }}
    />
  );
};

export default PDFPreview;
