import TitleNav from '@/components/bars/title-nav'
import EditClient from '@/components/editPage/EditClient'

interface PageProps {
  params: {
    id: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { id } = params
  return (
    <div className='h-screen flex flex-col bg-background'>
      <TitleNav text='Edit PDF' />
      <EditClient id={id} />
    </div>
  )
}

export default Page
