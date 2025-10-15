import TitleNav from '@/components/bars/title-nav'
import EditClient from '@/components/editPage/EditClient'

const Page = async ({ params }: { params: { id: string } }) => {
    const {id} = await params
    return (
        <div className='h-screen flex flex-col bg-background'>

            <TitleNav text='Edit PDF' />
            <EditClient id={id} />
        </div>
    )
}

export default Page