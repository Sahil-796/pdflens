import TitleNav from '@/components/bars/title-nav'
import Ppt2Pdf from '@/components/toolPages/PPT2PDF'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen flex flex-col'>

      <TitleNav text="PPT to Word" />
      <div className='flex-1 overflow-hidden p-4'>
        <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
          <Link href={'/tools'}>
            <Button variant='secondary' className='flex gap-2 cursor-pointer mb-6'>
              <ArrowLeft className='h-4 w-4' />
              Back to Toolbox
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            PPT to WORD Converter
          </h2>
          <p className="text-muted-foreground mb-6">
            Turn your PowerPoint slides into shareable PDFs in seconds — no quality loss.
          </p>
          <div className="flex-1 overflow-y-scroll p-2">
            <Ppt2Pdf />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
