"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { File, PanelLeftOpen, Scissors, Code, Merge } from "lucide-react";

export const tools = [
  {
    name: "Word to PDF",
    href: "/tools/word-to-pdf",
    icon: <File className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
    description:
      "Turn Word documents into secure, shareable PDF files in seconds.",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "PPT to PDF",
    href: "/tools/ppt-to-pdf",
    icon: (
      <PanelLeftOpen className="w-8 h-8 text-orange-500 dark:text-orange-400" />
    ),
    description:
      "Turn your PowerPoint slides into shareable PDFs in seconds — no quality loss.",
    accent: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "PDF to Word",
    href: "/tools/pdf-to-word",
    icon: <File className="w-8 h-8 text-blue-300 dark:text-blue-200" />,
    description:
      "Convert PDF files into Word documents while keeping layout consistent.",
    accent: "text-blue-400 dark:text-blue-200",
  },
  {
    name: "PDF to MD",
    href: "/tools/pdf-to-md",
    icon: <Code className="w-8 h-8 text-green-500 dark:text-green-400" />,
    description:
      "Convert your PDF documents into clean and editable Markdown files.",
    accent: "text-green-600 dark:text-green-400",
  },
  {
    name: "Merge PDF",
    href: "/tools/merge-pdf",
    icon: <Merge className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
    description: "Combine your PDFs into one neat file — quick and simple.",
    accent: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Split PDF",
    href: "/tools/split-pdf",
    icon: <Scissors className="w-8 h-8 text-orange-300 dark:text-orange-200" />,
    description:
      "Separate large PDFs into smaller files or extract specific pages easily.",
    accent: "text-orange-400 dark:text-orange-200",
  },
];

const ToolsHome = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Link key={tool.href} href={tool.href} className="group">
          <div
            className={cn(
              "relative flex flex-col items-center justify-between p-6 rounded-xl shadow-md transition-all duration-300",
              "hover:shadow-xl hover:-translate-y-1.5 transform-gpu will-change-transform",
              "hover:scale-[1.02]",
              "bg-background border border-border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer",
              "min-h-[180px]",
            )}
          >
            {/* Icon */}
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out transform-gpu">
              {tool.icon}
            </div>

            {/* Name */}
            <h3
              className={cn(
                "text-lg font-bold text-center transition-all duration-300 ease-in-out group-hover:scale-110",
                tool.accent,
              )}
            >
              {tool.name}
            </h3>

            {/* Description */}
            <p className="text-sm font-medium text-muted-foreground text-center mt-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              {tool.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ToolsHome;
