'use client'

import React from 'react'
import { motion } from 'framer-motion'
import PdfList from '../shared/PdfList'

const Recents: React.FC = () => {
    return (
        <div className='space-y-4'>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <h2 className="text-xl font-semibold text-foreground">Recent PDFs</h2>
                <p className="text-sm text-muted-foreground mt-1">Your recently created and edited documents</p>
            </motion.div>

            <PdfList
                limit={8}
                showDelete={true}
                showViewMore={true}
                emptyTitle="No PDFs Yet"
                emptyDescription="Create or upload one to get started!"
                emptyActionText="Create PDF"
                emptyActionPath="/generate"
            />
        </div>
    )
}

export default Recents