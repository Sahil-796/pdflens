import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/bars/LandingNavbar';
import FooterSection from '@/components/landingPage/footer';

export const metadata = {
  title: "AI PDF Generator — ZendraPdf",
  description: "Generate and edit PDFs using AI. ZendraPdf is a fast AI PDF generator that creates PDF documents from text, prompts, chat, and templates.",
  alternates: {
    canonical: "https://zendrapdf.vercel.app/ai-pdf-generator",
  },
};

export default function AIPdfGeneratorPage() {
  return (
    <div className="bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-24">
        <article className="space-y-8">
          <header>
            <h1 className="text-primary text-4xl font-bold md:text-5xl">
              AI PDF Generator — ZendraPdf
            </h1>
          </header>
          
          <section className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Generate and edit PDFs using AI. ZendraPdf is a fast AI PDF generator
              that creates PDF documents from text, prompts, chat, and templates.
            </p>
            
            <p className="text-muted-foreground">
              Transform your ideas into professional PDF documents with the power of artificial intelligence.
              ZendraPdf leverages advanced AI technology to help you create, edit, and manage PDFs effortlessly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-primary text-2xl font-semibold">
              What is an AI PDF Generator?
            </h2>
            <p className="text-muted-foreground">
              An AI PDF generator is a tool that uses artificial intelligence to automatically create
              PDF documents based on your input. Whether you provide text, prompts, or use templates,
              our AI understands your intent and generates professional-quality PDFs in seconds.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-primary text-2xl font-semibold">
              Key Features
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Generate PDFs from text prompts and natural language</li>
              <li>AI-powered editing and formatting</li>
              <li>Smart templates for common document types</li>
              <li>Convert various formats to PDF</li>
              <li>Merge, split, and organize PDF files</li>
              <li>Fast processing and instant downloads</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-primary text-2xl font-semibold">
              Why Choose ZendraPdf?
            </h2>
            <p className="text-muted-foreground">
              ZendraPdf combines the power of AI with user-friendly design to make PDF creation
              accessible to everyone. No design skills required—just describe what you need,
              and our AI will handle the rest.
            </p>
          </section>

          <section className="mt-12 rounded-2xl border bg-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Ready to Create Your First AI-Generated PDF?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Start creating professional PDFs with AI today. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="shadow">
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="shadow">
                  Explore PDF Tools
                </Button>
              </Link>
            </div>
          </section>
        </article>
      </main>
      <FooterSection />
    </div>
  );
}
