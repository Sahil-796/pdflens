import TitleNav from '@/components/bars/title-nav'
import EditClient from '@/components/editPage/EditClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return (
    <div className='h-screen flex flex-col bg-background'>
      <TitleNav text='Edit PDF' />
      <EditClient id={id} />
    </div>
  )
}
