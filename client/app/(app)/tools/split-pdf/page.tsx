import TitleNav from "@/components/bars/title-nav";
import SplitPDF from "@/components/toolPages/split-pdf";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h-screen flex flex-col">
      <TitleNav text="Split PDF" />
      <div className="flex-1 overflow-hidden p-4">
        <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
          <Link href={"/tools"} className="w-fit">
            <Button
              variant="secondary"
              className="flex gap-2 cursor-pointer mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Toolbox
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold text-orange-300 mb-2">
            Split PDF
          </h2>
          <p className="text-muted-foreground mb-6">
            Split pages or split range of pages of your PDFs
          </p>
          <div className="flex-1 overflow-y-scroll p-2">
            <SplitPDF />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
