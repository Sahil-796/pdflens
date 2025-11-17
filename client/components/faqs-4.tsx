'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Github, Twitter } from 'lucide-react'
import Image from 'next/image'

export default function FAQsFour() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'What can I create with Zendra?',
      answer: 'Anything from resumes and cover letters to business proposals, research papers, and reports. Just describe what you need.',
    },
    {
      id: 'item-2',
      question: 'How does the credit system work?',
      answer: 'Each AI generation uses 4 credits. Editing uses 1 credit. Free users get 20 credits daily, Pro users get 100.',
    },
    {
      id: 'item-3',
      question: 'Can I change or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.',
    },
    {
      id: 'item-4',
      question: 'Can I edit PDFs I upload?',
      answer: "Yes! Upload any PDF and use our AI editing tools to modify content.",
    },
    {
      id: 'item-5',
      question: 'What file formats do you support?',
      answer: 'Export to PDF and Word. Convert from Word, PPT, and PDF to various formats.',
    },
  ]

  const members = [
    {
      name: "Rudra",
      image: "/rudra.jpg",
      github: "https://github.com/",
      x: "https://x.com/",
    },
    {
      name: "Sahil",
      image: "/rudra.jpg",
      github: "https://github.com/",
      x: "https://x.com/",
    }
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1">
            {faqItems.map((item) => (
              <div
                className="group"
                key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Can't find what you're looking for? Call the <span className='text-primary font-bold'>devs</span>.
          </p>

        </div>
      </div>
    </section >
  )
}
