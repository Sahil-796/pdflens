"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEditorStore } from "@/store/useEditorStore";

const DownloadPDF = () => {
  const [loading, setLoading] = useState(false);
  const { fileName, draftHtml } = useEditorStore();

  async function handleDownload() {
    if (!draftHtml) return;

    setLoading(true);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(draftHtml, "text/html");
      doc.querySelector(".selected")?.classList.remove("selected");
      doc
        .querySelectorAll(".ai-response-container")
        .forEach((el) => el.remove());

      const cleanContent = doc.documentElement.outerHTML;

      const wrapper = document.createElement("div");
      wrapper.style.padding = "20px";
      wrapper.innerHTML = cleanContent;

      const res = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: wrapper.outerHTML }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "document"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF Downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleDownload}
      disabled={loading}
      className="hover:scale-105 transition-transform cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      As PDF
    </Button>
  );
};

export default DownloadPDF;
