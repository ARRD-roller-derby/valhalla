import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

const Agenda = dynamic(
  () => import('@/pages_related/agenda').then((comp) => comp.Agenda),
  { ssr: false }
)
export default function AgendaPage() {
  return <Agenda />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
