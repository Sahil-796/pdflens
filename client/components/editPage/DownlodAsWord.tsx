"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEditorStore } from "@/store/useEditorStore";

const DownloadAsWord = () => {
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

      if (!res.ok) throw new Error("Failed to convert to PDF");

      const pdfBlob = await res.blob();

      const formData = new FormData();
      formData.append("file", pdfBlob, "document.pdf");

      const finalRes = await fetch(`/api/tools/pdf-to-docx`, {
        method: "POST",
        body: formData,
      });

      if (!finalRes.ok) throw new Error("Failed to convert to DOCX");

      const docxBlob = await finalRes.blob();
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "document"}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Word Document Downloaded");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to download file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleDownload}
      disabled={loading}
      className="hover:scale-105 transition-transform cursor-pointer bg-blue-600/90 hover:bg-blue-600 text-white"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      As Word
    </Button>
  );
};

export default DownloadAsWord;
