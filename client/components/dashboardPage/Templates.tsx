import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Plus } from 'lucide-react'

const Templates = () => {
const templates = [
    "Resume",
    "Business-Proposal",
    "Cover-Letter",
    "Research-Paper",
    "Agreement",
    "Report",
]
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">Templates</h2>
                <Link href="/generate">
                    <Button
                        className="group bg-primary text-primary-foreground rounded-xl px-6 py-2 shadow-md hover:shadow-lg hover:scale-105 transition"
                    >
                        <Plus className='size-4 group-hover:scale-120 transition-all duration-200' />
                        <span>Create New PDF</span>
                    </Button>
                </Link>
            </div>

            {/* Template Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <Link
                        key={template}
                        href={`/generate?template=${encodeURIComponent(template)}`}
                        className="block"
                    >
                        <Card className="h-12 lg:h-18 flex items-center justify-center rounded-lg border border-border bg-card text-primary text-center font-medium cursor-pointer hover:bg-muted hover:text-primary transition overflow-hidden text-ellipsis">
                            {template}
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Templates