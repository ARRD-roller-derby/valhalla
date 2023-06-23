import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

const Index = dynamic(
  () => import('@/pages_related/index').then((comp) => comp.Index),
  { ssr: false }
)
export default function AgendaPage() {
  return <Index />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
