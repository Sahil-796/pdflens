import EditClient from '@/components/editPage/EditClient'

interface Pdf {
    id: string
    fileName: string
    htmlContent: string
    createdAt: string | null
}

const page = async ({ params }: { params: { id: string } }) => {
    return (
        <EditClient id={params.id} />
    )
}

export default page