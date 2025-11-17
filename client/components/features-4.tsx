import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap, FileText, FileType, FileDown, Split, Combine, FileSpreadsheet } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Features4() {

  const tools = [
    {
      title: "Word to PDF",
      icon: FileText,
      description: "Convert DOCX files into formatted PDFs instantly.",
      color: "text-blue-500",
    },
    {
      title: "PDF to Word",
      icon: FileType,
      description: "Extract editable content from any PDF.",
      color: "text-blue-300",
    },
    {
      title: "PDF to Markdown",
      icon: FileDown,
      description: "Turn PDFs into clean Markdown files.",
      color: "text-green-500",
    },
    {
      title: "Merge PDFs",
      icon: Combine,
      description: "Combine multiple documents into one seamless PDF.",
      color: "text-purple-500",
    },
    {
      title: "Split PDFs",
      icon: Split,
      description: "Extract pages or split a PDF into multiple files.",
      color: "text-orange-300",
    },
    {
      title: "PPT to PDF",
      icon: FileSpreadsheet,
      description: "Convert presentations into print-ready PDFs.",
      color: "text-orange-500",
    },
  ]
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-primary text-4xl font-medium lg:text-5xl">More Than Just Generation—Complete PDF Control
          </h2>
          <p className='-mt-6'>Everything you need to work with PDFs, all in one intelligent platform. Convert, edit, merge, and optimize your documents effortlessly.</p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {
            tools.map((tool, idx) => (
              <div key={idx} className="space-y-2">
                <div className={`flex items-center gap-2 ${tool.color}`}>
                  <tool.icon className="size-4" />
                  <h3 className="text-sm font-medium">{tool.title}</h3>
                </div>
                <p className="text-sm">{tool.description}</p>
              </div>
            ))
          }
        </div>
      </div>

      <div className="mt-14 flex justify-center">
        <Button asChild size="lg" className="rounded-xl px-6 text-base">
          <Link href="/tools">Explore All Tools</Link>
        </Button>
      </div>
    </section>
  )
}
