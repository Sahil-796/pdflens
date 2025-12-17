"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileUser,
  Briefcase,
  Mail,
  GraduationCap,
  Scale,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { TEMPLATE_PROMPTS } from "@/lib/templates";

const getTemplateConfig = (key: string) => {
  switch (key) {
    case "Resume":
      return {
        icon: FileUser,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        label: "Career",
      };
    case "Business-Proposal":
      return {
        icon: Briefcase,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        label: "Business",
      };
    case "Cover-Letter":
      return {
        icon: Mail,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        label: "Career",
      };
    case "Research-Paper":
      return {
        icon: GraduationCap,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        label: "Academic",
      };
    case "Agreement":
      return {
        icon: Scale,
        color: "text-red-500",
        bg: "bg-red-500/10",
        label: "Legal",
      };
    case "Report":
      return {
        icon: FileText,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        label: "General",
      };
    default:
      return {
        icon: Sparkles,
        color: "text-primary",
        bg: "bg-primary/10",
        label: "AI",
      };
  }
};

const TemplatesPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Choose a Template</h1>
        <p className="text-muted-foreground">
          Jumpstart your document creation with our AI-optimized presets.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Object.keys(TEMPLATE_PROMPTS).map((key) => {
          const config = getTemplateConfig(key);
          const Icon = config.icon;
          const formattedTitle = key.replace(/-/g, " ");

          return (
            <motion.div key={key} variants={item} whileHover={{ y: -4 }}>
              <Link href={`/generate?template=${key}`} className="block h-full">
                <Card className="h-full border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${config.bg.replace("/10", "/30")}`}
                  />

                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div
                        className={`p-3 rounded-xl ${config.bg} ${config.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border px-2 py-0.5 rounded-full">
                        {config.label}
                      </span>
                    </div>
                    <CardTitle className="text-xl capitalize">
                      {formattedTitle}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      Generate a professional {formattedTitle.toLowerCase()}{" "}
                      including structured sections, placeholders, and
                      formatting tailored for {config.label.toLowerCase()} use
                      cases.
                    </CardDescription>

                    <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2.5 group-hover:translate-x-0">
                      Use Template <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TemplatesPage;
