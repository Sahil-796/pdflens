import TitleNav from '@/components/bars/title-nav'
import MergePdf from '@/components/toolPages/merge-pdf'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div className='h-screen flex flex-col'>

      <TitleNav text="PDF to MD" />
      <div className='flex-1 overflow-hidden p-4'>
        <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
          <Link href={'/tools'}>
            <Button variant='secondary' className='flex gap-2 cursor-pointer mb-6'>
              <ArrowLeft className='h-4 w-4' />
              Back to Toolbox
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Merge PDF
          </h2>
          <p className="text-muted-foreground mb-6">
            Combine your PDFs into one neat file — quick and simple.
          </p>
          <div className="flex-1 overflow-y-scroll p-2">
            <MergePdf />
          </div>
        </div>
      </div>
    </div>
  )
}
