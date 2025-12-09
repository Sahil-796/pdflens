"use client";

import { Dot, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEditorStore } from "@/store/useEditorStore";
import { useSavePdf } from "@/hooks/mutations/useSavePdf";

const SaveChanges = () => {
  const { activePdfId, fileName, draftHtml, isDirty } = useEditorStore();

  const { mutate: savePdf, isPending } = useSavePdf();

  const handleSave = () => {
    if (!draftHtml || !activePdfId) return;

    if (!fileName.trim()) {
      toast.error("Filename can't be empty");
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(draftHtml, "text/html");
    const selectedEl = doc.querySelector(".selected");
    if (selectedEl) {
      selectedEl.classList.remove("selected");
    }
    const cleanHtml = doc.documentElement.outerHTML;

    savePdf({
      id: activePdfId,
      html: cleanHtml,
      fileName,
    });
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleSave}
      disabled={isPending}
      className="hover:scale-105 transition-transform cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Save className="w-4 h-4 mr-2" />
      )}
      <span>Save</span>

      {isDirty && (
        <Dot className="text-primary -mr-2 scale-150 animate-pulse" />
      )}
    </Button>
  );
};

export default SaveChanges;
