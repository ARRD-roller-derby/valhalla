// Bibliothèques externes
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

// Import dynamique
const Event = dynamic(() => import('@/pages_related').then((comp) => comp.Event), { ssr: false })

export default function EventPage() {
  return <Event />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
