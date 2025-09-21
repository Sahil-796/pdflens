import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const EditPDF = () => {
    return (
        <div className='flex-1'>
            <Tabs defaultValue="ai-edit" className="w-full">
                <TabsList>
                    <TabsTrigger className='text-lg font-medium' value="ai-edit">AI Edit</TabsTrigger>
                    <TabsTrigger className='text-lg font-medium' value="replace">Replace Text</TabsTrigger>
                </TabsList>
                <TabsContent value="ai-edit">
                    Editting using AI
                </TabsContent>
                    Manual Text Replacement
                <TabsContent value="replace">
                    
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditPDF