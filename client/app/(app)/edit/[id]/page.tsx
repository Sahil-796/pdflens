import EditClient from '@/components/editPage/EditClient'

const Page = async ({ params }: { params: { id: string } }) => {
    const {id} = await params
    return (
        <EditClient id={id} />
    )
}

export default Page